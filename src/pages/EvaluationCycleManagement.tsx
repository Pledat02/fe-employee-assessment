import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useEvaluationCycles } from '../hooks/useEvaluationCycles';
import { EvaluationCycleCreateRequest } from '../services/evaluationCycleService';
import {
    criteriaFormService,
    CriteriaFormResponse,
    CriteriaFormCreateRequest
} from '../services/criteriaFormService';
import EvaluationCycleFormModal from '../components/EvaluationCycleFormModal';
import CriteriaFormModal from '../components/EvaluationFormFormModal';

const ITEMS_PER_PAGE = 10;

const EvaluationCycleManagement: React.FC = () => {
    const {
        evaluationCycles,
        loading,
        error,
        totalEvaluationCycles,
        refreshEvaluationCycles,
        createEvaluationCycle,
        updateEvaluationCycle,
        deleteEvaluationCycle,
    } = useEvaluationCycles();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingCycleId, setDeletingCycleId] = useState<number | null>(null);
    const [showAddCycleModal, setShowAddCycleModal] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<any>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [expandedCycle, setExpandedCycle] = useState<Set<number>>(new Set());
    const [expandedForm, setExpandedForm] = useState<Set<number>>(new Set());
    const [forms, setForms] = useState<{ [cycleId: number]: CriteriaFormResponse[] }>({});
    const [showAddFormModal, setShowAddFormModal] = useState(false);
    const [selectedForm, setSelectedForm] = useState<CriteriaFormResponse | null>(null);
    const [selectedCycleIdForForm, setSelectedCycleIdForForm] = useState<number | null>(null);
    const [deletingFormId, setDeletingFormId] = useState<number | null>(null);

    const filteredEvaluationCycles = useMemo(() => {
        return evaluationCycles.filter(cycle =>
            cycle.department?.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cycle.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [evaluationCycles, searchTerm]);

    const totalPages = Math.ceil(filteredEvaluationCycles.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedCycles = filteredEvaluationCycles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Fetch forms for all cycles on mount or refresh
    useEffect(() => {
        const fetchForms = async () => {
            const formPromises = evaluationCycles.map(cycle =>
                criteriaFormService.getCriteriaFormsByEvaluationCycleId(cycle.evaluationCycleId)
                    .then(forms => ({ cycleId: cycle.evaluationCycleId, forms }))
                    .catch(error => {
                        toast.error(error.message || `Không thể lấy biểu mẫu cho chu kỳ `);
                        return { cycleId: cycle.evaluationCycleId, forms: [] };
                    })
            );
            const results = await Promise.all(formPromises);
            const newForms = results.reduce((acc, { cycleId, forms }) => {
                acc[cycleId] = forms;
                return acc;
            }, {} as { [cycleId: number]: CriteriaFormResponse[] });
            setForms(newForms);
        };
        if (evaluationCycles.length > 0) {
            fetchForms();
        }
    }, [evaluationCycles]);

    const handleAddCycle = () => {
        setSelectedCycle(null);
        setIsEditMode(false);
        setShowAddCycleModal(true);
    };

    const handleEditCycle = (cycle: any) => {
        setSelectedCycle(cycle);
        setIsEditMode(true);
        setShowAddCycleModal(true);
    };

    const handleDeleteCycle = async (id: number, startDate: string) => {
        if (window.confirm(`Bạn có chắc muốn xóa chu kỳ đánh giá bắt đầu từ ${startDate}?`)) {
            try {
                setDeletingCycleId(id);
                await deleteEvaluationCycle(id);
                setForms(prev => {
                    const updated = { ...prev };
                    delete updated[id];
                    return updated;
                });
                const newFilteredCount = filteredEvaluationCycles.filter(cycle => cycle.evaluationCycleId !== id).length;
                const newTotalPages = Math.ceil(newFilteredCount / ITEMS_PER_PAGE);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(1);
                }
                toast.success('Xóa chu kỳ thành công');
            } catch (error: any) {
                toast.error(error.message || 'Không thể xóa chu kỳ đánh giá');
            } finally {
                setDeletingCycleId(null);
            }
        }
    };

    const handleSaveCycle = async (data: EvaluationCycleCreateRequest) => {
        try {
            if (isEditMode && selectedCycle) {
                await updateEvaluationCycle(selectedCycle.evaluationCycleId, data);
                toast.success('Cập nhật chu kỳ thành công');
            } else {
                await createEvaluationCycle(data);
                toast.success('Tạo chu kỳ thành công');
            }
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra khi lưu chu kỳ đánh giá');
            throw error;
        }
    };

    const handleAddForm = (cycleId: number) => {
        setSelectedForm(null);
        setSelectedCycleIdForForm(cycleId);
        setShowAddFormModal(true);
    };

    const handleEditForm = (form: CriteriaFormResponse, cycleId: number) => {
        setSelectedForm(form);
        setSelectedCycleIdForForm(cycleId);
        setShowAddFormModal(true);
    };

    const handleDeleteForm = async (formId: number, cycleId: number, formName: string) => {
        if (window.confirm(`Bạn có chắc muốn xóa biểu mẫu "${formName}"?`)) {
            try {
                setDeletingFormId(formId);
                await criteriaFormService.deleteCriteriaForm(formId);
                setForms(prev => ({
                    ...prev,
                    [cycleId]: prev[cycleId].filter(form => form.criteriaFormId !== formId),
                }));
                toast.success('Xóa biểu mẫu thành công');
            } catch (error: any) {
                toast.error(error.message || 'Không thể xóa biểu mẫu đánh giá');
            } finally {
                setDeletingFormId(null);
            }
        }
    };

    const handleSaveForm = async (data: CriteriaFormCreateRequest) => {
        try {
            if (selectedForm) {
                await criteriaFormService.updateCriteriaForm(selectedForm.criteriaFormId, data);
                setForms(prev => ({
                    ...prev,
                    [Number(data.evaluationCycleId)]: prev[Number(data.evaluationCycleId)].map(form =>
                        form.criteriaFormId === selectedForm.criteriaFormId ? { ...form, criteriaFormName: data.criteriaFormName, evaluationCriteria: data.evaluationCriteriaIds.map(id => ({ evaluationCriteriaId: id, criteriaName: `Tiêu chí ${id}` })) } : form
                    ),
                }));
                toast.success('Cập nhật biểu mẫu thành công');
            } else {
                const newForm = await criteriaFormService.createCriteriaForm(data);
                setForms(prev => ({
                    ...prev,
                    [Number(data.evaluationCycleId)]: [...(prev[Number(data.evaluationCycleId)] || []), newForm],
                }));
                toast.success('Tạo biểu mẫu thành công');
            }
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra khi lưu biểu mẫu');
            throw error;
        }
    };

    const toggleCycleExpansion = (cycleId: number) => {
        setExpandedCycle(prev => {
            const newSet = new Set(prev);
            if (newSet.has(cycleId)) {
                newSet.delete(cycleId);
            } else {
                newSet.add(cycleId);
            }
            return newSet;
        });
    };

    const toggleFormExpansion = (formId: number) => {
        setExpandedForm(prev => {
            const newSet = new Set(prev);
            if (newSet.has(formId)) {
                newSet.delete(formId);
            } else {
                newSet.add(formId);
            }
            return newSet;
        });
    };

    const getFormCountBadge = (formCount: number) => {
        if (formCount === 0) return 'bg-red-100 text-red-800';
        if (formCount <= 2) return 'bg-yellow-100 text-yellow-800';
        if (formCount <= 5) return 'bg-blue-100 text-blue-800';
        return 'bg-green-100 text-green-800';
    };

    const getCriteriaCountBadge = (criteriaCount: number) => {
        if (criteriaCount === 0) return 'bg-red-100 text-red-800';
        if (criteriaCount <= 2) return 'bg-yellow-100 text-yellow-800';
        if (criteriaCount <= 5) return 'bg-blue-100 text-blue-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <div className="p-6">
            <div className="rounded-lg bg-white shadow-md">
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý chu kỳ và biểu mẫu đánh giá</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Tổng số: <span className="font-medium">{filteredEvaluationCycles.length}</span> chu kỳ
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={refreshEvaluationCycles}
                                disabled={loading}
                                className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
                            >
                                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {loading ? 'Đang tải...' : 'Làm mới'}
                            </button>
                            <button
                                onClick={handleAddCycle}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Thêm chu kỳ
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Tìm kiếm</label>
                            <input
                                type="text"
                                placeholder="Tên phòng ban, trạng thái..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setCurrentPage(1);
                                    refreshEvaluationCycles();
                                }}
                                className="w-full rounded-md bg-gray-500 px-3 py-2 text-white hover:bg-gray-600"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mx-6 mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        <strong>Lỗi:</strong> {error}
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="size-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                        <span className="ml-2">Đang tải...</span>
                    </div>
                )}

                {!loading && (
                    <div className="space-y-4">
                        {paginatedCycles.map(cycle => {
                            const formCount = forms[cycle.evaluationCycleId]?.length || 0;
                            const isExpanded = expandedCycle.has(cycle.evaluationCycleId);

                            return (
                                <div key={cycle.evaluationCycleId} className="rounded-lg border border-gray-200 bg-white shadow-sm">
                                    <div className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="shrink-0">
                                                    <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                                                        <svg className="size-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3">
                                                        <h3 className="text-lg font-medium text-gray-900">{cycle.startDate} - {cycle.endDate}</h3>
                                                        <span className="text-sm text-gray-500">ID: {cycle.evaluationCycleId}</span>
                                                    </div>
                                                    <div className="mt-1 flex items-center space-x-4">
                                                        <span className="text-sm text-gray-500">Phòng ban: {cycle.department?.departmentName || 'N/A'}</span>
                                                        <span className="text-sm text-gray-500">Bắt đầu: {cycle.startDate}</span>
                                                        <span className="text-sm text-gray-500">Kết thúc: {cycle.endDate}</span>
                                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getFormCountBadge(formCount)}`}>
                                                            {formCount} biểu mẫu
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEditCycle(cycle)}
                                                    disabled={deletingCycleId === cycle.evaluationCycleId}
                                                    className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-1 text-sm font-medium leading-4 text-blue-700 transition-colors hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <svg className="mr-1 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => toggleCycleExpansion(cycle.evaluationCycleId)}
                                                    className="inline-flex items-center rounded-md border border-transparent bg-gray-100 px-3 py-1 text-sm font-medium leading-4 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                                >
                                                    <svg className={`mr-1 size-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                    {isExpanded ? 'Thu gọn' : `Xem biểu mẫu (${formCount})`}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCycle(cycle.evaluationCycleId, cycle.startDate)}
                                                    disabled={deletingCycleId === cycle.evaluationCycleId}
                                                    className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-1 text-sm font-medium leading-4 text-red-700 transition-colors hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {deletingCycleId === cycle.evaluationCycleId ? (
                                                        <>
                                                            <svg className="mr-1 size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Đang xóa...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="mr-1 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Xóa
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {isExpanded && (
                                        <div className="border-t border-gray-200 bg-gray-50">
                                            <div className="px-6 py-4">
                                                <div className="mb-4 flex items-center justify-between">
                                                    <h4 className="text-md font-medium text-gray-900">Biểu mẫu đánh giá ({formCount})</h4>
                                                    <button
                                                        onClick={() => handleAddForm(cycle.evaluationCycleId)}
                                                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
                                                    >
                                                        <svg className="mr-1 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        Thêm biểu mẫu
                                                    </button>
                                                </div>
                                                {formCount === 0 ? (
                                                    <div className="py-8 text-center">
                                                        <svg className="mx-auto size-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                        </svg>
                                                        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có biểu mẫu</h3>
                                                        <p className="mt-1 text-sm text-gray-500">Hãy thêm biểu mẫu mới để bắt đầu.</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {forms[cycle.evaluationCycleId]?.map(form => {
                                                            const criteriaCount = form.evaluationCriteria?.length || 0;
                                                            const isFormExpanded = expandedForm.has(form.criteriaFormId);
                                                            return (
                                                                <div key={form.criteriaFormId} className="rounded-md border border-gray-200 bg-white p-4">
                                                                    <div className="flex items-start justify-between">
                                                                        <div className="flex-1">
                                                                            <div className="mb-2 flex items-center space-x-2">
                                                                                <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
                                                                                    Biểu mẫu {form.criteriaFormId}
                                                                                </span>
                                                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getCriteriaCountBadge(criteriaCount)}`}>
                                                                                    {criteriaCount} tiêu chí
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-sm leading-relaxed text-gray-900">{form.criteriaFormName}</p>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <button
                                                                                onClick={() => toggleFormExpansion(form.criteriaFormId)}
                                                                                className="inline-flex items-center rounded-md border border-transparent bg-gray-100 px-2 py-1 text-sm font-medium leading-4 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                                                            >
                                                                                <svg className={`mr-1 size-4 transition-transform ${isFormExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                                </svg>
                                                                                {isFormExpanded ? 'Thu gọn' : `Xem tiêu chí (${criteriaCount})`}
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleEditForm(form, cycle.evaluationCycleId)}
                                                                                disabled={deletingFormId === form.criteriaFormId}
                                                                                className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-2 py-1 text-sm font-medium leading-4 text-blue-700 transition-colors hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                            >
                                                                                <svg className="mr-1 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                </svg>
                                                                                Sửa
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteForm(form.criteriaFormId, cycle.evaluationCycleId, form.criteriaFormName)}
                                                                                disabled={deletingFormId === form.criteriaFormId}
                                                                                className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-2 py-1 text-sm font-medium leading-4 text-red-700 transition-colors hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                            >
                                                                                {deletingFormId === form.criteriaFormId ? (
                                                                                    <>
                                                                                        <svg className="mr-1 size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                                        </svg>
                                                                                        Đang xóa...
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <svg className="mr-1 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                        </svg>
                                                                                        Xóa
                                                                                    </>
                                                                                )}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    {isFormExpanded && (
                                                                        <div className="mt-4 border-t border-gray-200 bg-gray-50 p-4">
                                                                            <h5 className="text-sm font-medium text-gray-900">Tiêu chí đánh giá ({criteriaCount})</h5>
                                                                            {criteriaCount === 0 ? (
                                                                                <p className="mt-2 text-sm text-gray-500">Chưa có tiêu chí nào.</p>
                                                                            ) : (
                                                                                <div className="mt-2 space-y-2">
                                                                                    {form.evaluationCriteria?.map(criterion => (
                                                                                        <div key={criterion.evaluationCriteriaId} className="flex items-center justify-between rounded-md bg-white p-2 shadow-sm">
                                                                                            <span className="text-sm text-gray-900">{criterion.criteriaName}</span>
                                                                                            <span className="text-sm text-gray-500">ID: {criterion.evaluationCriteriaId}</span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && filteredEvaluationCycles.length === 0 && (
                    <div className="py-12 text-center">
                        <svg className="mx-auto size-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Không có chu kỳ đánh giá</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm ? 'Không tìm thấy chu kỳ phù hợp với bộ lọc.' : 'Chưa có chu kỳ đánh giá nào trong hệ thống.'}
                        </p>
                        {!searchTerm && (
                            <div className="mt-4">
                                <button
                                    onClick={handleAddCycle}
                                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    <svg className="mr-2 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Tạo chu kỳ đầu tiên
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {!loading && filteredEvaluationCycles.length > 0 && totalPages > 1 && (
                    <div className="border-t border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredEvaluationCycles.length)} trong tổng số {filteredEvaluationCycles.length} chu kỳ
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Trước
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`rounded-md border px-3 py-1 text-sm ${
                                            currentPage === page ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <EvaluationCycleFormModal
                    isOpen={showAddCycleModal}
                    isEditMode={isEditMode}
                    evaluationCycle={selectedCycle}
                    onClose={() => {
                        setShowAddCycleModal(false);
                        setSelectedCycle(null);
                        setIsEditMode(false);
                    }}
                    onSave={handleSaveCycle}
                />
                <CriteriaFormModal
                    isOpen={showAddFormModal}
                    isEditMode={selectedForm !== null}
                    criteriaForm={selectedForm}
                    cycleId={selectedCycleIdForForm || 0}
                    onClose={() => {
                        setShowAddFormModal(false);
                        setSelectedForm(null);
                        setSelectedCycleIdForForm(null);
                    }}
                    onSave={handleSaveForm}
                />
            </div>
        </div>
    );
};

export default EvaluationCycleManagement;