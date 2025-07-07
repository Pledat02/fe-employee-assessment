import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useEvaluationCycles } from '../hooks/useEvaluationCycles';
import { EvaluationCycleCreateRequest } from '../services/evaluationCycleService';
import EvaluationCycleFormModal from '../components/EvaluationCycleFormModal';

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

    const filteredEvaluationCycles = useMemo(() => {
        return evaluationCycles.filter(cycle =>
            cycle.department?.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cycle.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [evaluationCycles, searchTerm]);

    const totalPages = Math.ceil(filteredEvaluationCycles.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedCycles = filteredEvaluationCycles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
                const newFilteredCount = filteredEvaluationCycles.filter(cycle => cycle.evaluationCycleId !== id).length;
                const newTotalPages = Math.ceil(newFilteredCount / ITEMS_PER_PAGE);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(1);
                }
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
            } else {
                await createEvaluationCycle(data);
            }
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra khi lưu chu kỳ đánh giá');
            throw error;
        }
    };

    const handleRefresh = () => {
        refreshEvaluationCycles();
    };

    return (
        <div className="p-6">
            <div className="rounded-lg bg-white shadow-md">
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý chu kỳ đánh giá</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Tổng số: {filteredEvaluationCycles.length} chu kỳ
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
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Tìm kiếm
                            </label>
                            <input
                                type="text"
                                placeholder="Tên phòng ban, trạng thái..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setCurrentPage(1);
                                }}
                                className="rounded-md bg-gray-500 px-3 py-2 text-white hover:bg-gray-600"
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
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Phòng ban
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Ngày bắt đầu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Ngày kết thúc
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Thao tác
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {paginatedCycles.map((cycle) => (
                                <tr key={cycle.evaluationCycleId} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                        {cycle.evaluationCycleId}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="size-10 shrink-0">
                                                <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                                                    <svg className="size-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {cycle.department?.departmentName || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                        {cycle.startDate}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                        {cycle.endDate}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          cycle.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              cycle.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                                  'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cycle.status}
                      </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                        <div className="flex items-center space-x-3">
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
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && filteredEvaluationCycles.length === 0 && (
                    <div className="py-12 text-center">
                        <svg className="mx-auto size-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Không có chu kỳ đánh giá</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm
                                ? 'Không tìm thấy chu kỳ đánh giá phù hợp với từ khóa tìm kiếm.'
                                : 'Chưa có chu kỳ đánh giá nào trong hệ thống.'
                            }
                        </p>
                    </div>
                )}

                {!loading && filteredEvaluationCycles.length > 0 && totalPages > 1 && (
                    <div className="border-t border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredEvaluationCycles.length)}
                                trong tổng số {filteredEvaluationCycles.length} chu kỳ
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
                                            currentPage === page
                                                ? 'border-blue-600 bg-blue-600 text-white'
                                                : 'border-gray-300 hover:bg-gray-50'
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
            </div>
        </div>
    );
};

export default EvaluationCycleManagement;