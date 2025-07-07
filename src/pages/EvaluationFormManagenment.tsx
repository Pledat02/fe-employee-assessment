import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';

import { CriteriaFormCreateRequest, CriteriaFormResponse } from '../services/criteriaFormService';
import {useCriteriaForm} from "../hooks/useEvaluationForm";
import CriteriaFormModal from "../components/EvaluationFormFormModal";


const ITEMS_PER_PAGE = 10;

const CriteriaFormManagement: React.FC = () => {
    const {
        forms,
        loading,
        error,
        totalForms,
        refreshForms,
        createForm,
        updateForm,
        deleteForm,
        searchForms,
    } = useCriteriaForm();

    const [searchTerm, setSearchTerm] = useState('');
    const [evaluationCycleId, setEvaluationCycleId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingFormId, setDeletingFormId] = useState<number | null>(null);
    const [expandedForm, setExpandedForm] = useState<Set<number>>(new Set());
    const [showAddFormModal, setShowAddFormModal] = useState(false);
    const [selectedForm, setSelectedForm] = useState<CriteriaFormResponse | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const filteredForms = useMemo(() => {
        let filtered = forms.filter(item =>
            item.criteriaFormName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (evaluationCycleId) {
            filtered = filtered.filter(item => item.evaluationCycleId === evaluationCycleId);
        }

        return filtered;
    }, [forms, searchTerm, evaluationCycleId]);

    const totalPages = Math.ceil(filteredForms.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedForms = filteredForms.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleAddForm = () => {
        setSelectedForm(null);
        setIsEditMode(false);
        setShowAddFormModal(true);
    };

    const handleEditForm = (form: CriteriaFormResponse) => {
        setSelectedForm(form);
        setIsEditMode(true);
        setShowAddFormModal(true);
    };

    const handleDeleteForm = async (id: number, name: string) => {
        if (window.confirm(`Bạn có chắc muốn xóa biểu mẫu "${name}"?`)) {
            try {
                setDeletingFormId(id);
                await deleteForm(id);
                const newFilteredCount = filteredForms.filter(item => item.criteriaFormId !== id).length;
                const newTotalPages = Math.ceil(newFilteredCount / ITEMS_PER_PAGE);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(1);
                }
            } catch (error: any) {
                toast.error(error.message || 'Không thể xóa biểu mẫu');
            } finally {
                setDeletingFormId(null);
            }
        }
    };

    const handleSaveForm = async (data: CriteriaFormCreateRequest) => {
        try {
            if (isEditMode && selectedForm) {
                await updateForm(selectedForm.criteriaFormId, data);
            } else {
                await createForm(data);
            }
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra khi lưu biểu mẫu');
            throw error;
        }
    };

    const handleRefresh = () => {
        refreshForms();
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
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý biểu mẫu tiêu chí</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Tổng số: <span className="font-medium">{filteredForms.length}</span> biểu mẫu
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
                            >
                                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {loading ? 'Đang tải...' : 'Làm mới'}
                            </button>
                            <button
                                onClick={handleAddForm}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Thêm biểu mẫu
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Tìm kiếm</label>
                            <input
                                type="text"
                                placeholder="Tên biểu mẫu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Chu kỳ đánh giá</label>
                            <input
                                type="text"
                                placeholder="Mã chu kỳ..."
                                value={evaluationCycleId}
                                onChange={(e) => setEvaluationCycleId(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setEvaluationCycleId('');
                                    setCurrentPage(1);
                                    refreshForms();
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
                        {paginatedForms.map((form) => {
                            const criteriaCount = form.evaluationCriteria?.length || 0;
                            const isExpanded = expandedForm.has(form.criteriaFormId);

                            return (
                                <div key={form.criteriaFormId} className="rounded-lg border border-gray-200 bg-white shadow-sm">
                                    <div className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="shrink-0">
                                                    <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                                                        <svg className="size-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3">
                                                        <h3 className="text-lg font-medium text-gray-900">{form.criteriaFormName}</h3>
                                                        <span className="text-sm text-gray-500">ID: {form.criteriaFormId}</span>
                                                    </div>
                                                    <div className="mt-1 flex items-center space-x-4">
                                                        <span className="text-sm text-gray-500">Chu kỳ: {form.evaluationCycleId}</span>
                                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getCriteriaCountBadge(criteriaCount)}`}>
                              {criteriaCount} tiêu chí
                            </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEditForm(form)}
                                                    disabled={deletingFormId === form.criteriaFormId}
                                                    className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-1 text-sm font-medium leading-4 text-blue-700 transition-colors hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <svg className="mr-1 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => toggleFormExpansion(form.criteriaFormId)}
                                                    className="inline-flex items-center rounded-md border border-transparent bg-gray-100 px-3 py-1 text-sm font-medium leading-4 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                                >
                                                    <svg className={`mr-1 size-4 transition-transform${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                    {isExpanded ? 'Thu gọn' : `Xem tiêu chí (${criteriaCount})`}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteForm(form.criteriaFormId, form.criteriaFormName)}
                                                    disabled={deletingFormId === form.criteriaFormId}
                                                    className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-1 text-sm font-medium leading-4 text-red-700 transition-colors hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                                    </div>
                                    {isExpanded && (
                                        <div className="border-t border-gray-200 bg-gray-50">
                                            <div className="px-6 py-4">
                                                <h4 className="text-md mb-4 font-medium text-gray-900">Tiêu chí đánh giá ({criteriaCount})</h4>
                                                {criteriaCount === 0 ? (
                                                    <div className="py-8 text-center">
                                                        <svg className="mx-auto size-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có tiêu chí</h3>
                                                        <p className="mt-1 text-sm text-gray-500">Hãy chỉnh sửa biểu mẫu để thêm tiêu chí.</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {form.evaluationCriteria?.map((criteria, index) => (
                                                            <div key={criteria.evaluationCriteriaId} className="rounded-md border border-gray-200 bg-white p-4">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <div className="mb-2 flex items-center space-x-2">
                                      <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
                                        Tiêu chí {index + 1}
                                      </span>
                                                                        </div>
                                                                        <p className="text-sm leading-relaxed text-gray-900">{criteria.criteriaName}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
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

                {!loading && filteredForms.length === 0 && (
                    <div className="py-12 text-center">
                        <svg className="mx-auto size-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Không có biểu mẫu tiêu chí</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || evaluationCycleId ? 'Không tìm thấy biểu mẫu phù hợp với bộ lọc.' : 'Chưa có biểu mẫu tiêu chí nào trong hệ thống.'}
                        </p>
                        {!searchTerm && !evaluationCycleId && (
                            <div className="mt-4">
                                <button
                                    onClick={handleAddForm}
                                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    <svg className="mr-2 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Tạo biểu mẫu đầu tiên
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {!loading && filteredForms.length > 0 && totalPages > 1 && (
                    <div className="border-t border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredForms.length)} trong tổng số {filteredForms.length} biểu mẫu
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

                <CriteriaFormModal
                    isOpen={showAddFormModal}
                    isEditMode={isEditMode}
                    form={selectedForm}
                    onClose={() => {
                        setShowAddFormModal(false);
                        setSelectedForm(null);
                        setIsEditMode(false);
                    }}
                    onSave={handleSaveForm}
                />
            </div>
        </div>
    );
};

export default CriteriaFormManagement;