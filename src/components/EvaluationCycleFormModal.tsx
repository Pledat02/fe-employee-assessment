import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { EvaluationCycleCreateRequest, EvaluationCycleResponse, DepartmentResponse } from '../services/evaluationCycleService';
import { departmentService } from '../services/departmentService';

interface EvaluationCycleFormModalProps {
    isOpen: boolean;
    isEditMode: boolean;
    evaluationCycle?: EvaluationCycleResponse | null;
    onClose: () => void;
    onSave: (data: EvaluationCycleCreateRequest) => Promise<void>;
}

const EvaluationCycleFormModal: React.FC<EvaluationCycleFormModalProps> = ({
                                                                               isOpen,
                                                                               isEditMode,
                                                                               evaluationCycle,
                                                                               onClose,
                                                                               onSave,
                                                                           }) => {
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
    const [formData, setFormData] = useState<EvaluationCycleCreateRequest>({
        departmentId: 0,
        startDate: '',
        endDate: '',
        status: 'DRAFT',
    });

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const departmentList = await departmentService.getAllDepartments();
                setDepartments(departmentList);
            } catch (error) {
                toast.error('Không thể tải danh sách phòng ban');
            }
        };
        if (isOpen) {
            fetchDepartments();
            if (isEditMode && evaluationCycle) {
                setFormData({
                    departmentId: evaluationCycle.department?.departmentId || 0,
                    startDate: evaluationCycle.startDate,
                    endDate: evaluationCycle.endDate,
                    status: evaluationCycle.status,
                });
            } else {
                setFormData({
                    departmentId: 0,
                    startDate: '',
                    endDate: '',
                    status: 'DRAFT',
                });
            }
        }
    }, [isOpen, isEditMode, evaluationCycle]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'departmentId' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.departmentId === 0) {
            toast.error('Vui lòng chọn phòng ban');
            return;
        }
        if (!formData.startDate) {
            toast.error('Vui lòng nhập ngày bắt đầu');
            return;
        }
        if (!formData.endDate) {
            toast.error('Vui lòng nhập ngày kết thúc');
            return;
        }
        if (!formData.status) {
            toast.error('Vui lòng chọn trạng thái');
            return;
        }

        try {
            setLoading(true);
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Save evaluation cycle error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {isEditMode ? 'Sửa chu kỳ đánh giá' : 'Thêm chu kỳ đánh giá mới'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round RpcCap" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Phòng ban *
                        </label>
                        <select
                            name="departmentId"
                            value={formData.departmentId}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value={0}>Chọn phòng ban</option>
                            {departments.map(dept => (
                                <option key={dept.departmentId} value={dept.departmentId}>
                                    {dept.departmentName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Ngày bắt đầu *
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Ngày kết thúc *
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Trạng thái *
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="DRAFT">Nháp</option>
                            <option value="ACTIVE">Đang hoạt động</option>
                            <option value="COMPLETED">Hoàn thành</option>
                        </select>
                    </div>

                    <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
                        <div className="flex">
                            <div className="shrink-0">
                                <svg className="size-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    Lưu ý
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <ul className="list-inside list-disc space-y-1">
                                        <li>Ngày bắt đầu phải trước ngày kết thúc</li>
                                        <li>Không thể có hai chu kỳ đánh giá trùng lặp trong cùng một phòng ban</li>
                                        <li>Chu kỳ ở trạng thái Hoàn thành không thể chỉnh sửa</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading && (
                                <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {loading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Thêm mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EvaluationCycleFormModal;