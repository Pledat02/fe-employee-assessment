import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CriteriaFormResponse, CriteriaFormCreateRequest } from '../services/criteriaFormService';
import { evaluationCriteriaService } from '../services/evaluationCriteriaService';
import { evaluationCycleService } from '../services/evaluationCycleService'; // Hypothetical service for fetching cycles

interface CriteriaFormModalProps {
    isOpen: boolean;
    isEditMode: boolean;
    criteriaForm: CriteriaFormResponse | null;
    cycleId: number;
    onClose: () => void;
    onSave: (data: CriteriaFormCreateRequest) => Promise<void>;
}

const CriteriaFormModal: React.FC<CriteriaFormModalProps> = ({
                                                                 isOpen,
                                                                 isEditMode,
                                                                 criteriaForm,
                                                                 cycleId,
                                                                 onClose,
                                                                 onSave,
                                                             }) => {
    const [loading, setLoading] = useState(false);
    const [criteriaLoading, setCriteriaLoading] = useState(false);
    const [formData, setFormData] = useState<CriteriaFormCreateRequest>({
        criteriaFormName: '',
        evaluationCycleId: String(cycleId), // Prefill with cycleId
        evaluationCriteriaIds: [],
    });
    const [availableCriteria, setAvailableCriteria] = useState<{ id: number; name: string }[]>([]);
    const [availableCycles, setAvailableCycles] = useState<{ id: string; name: string }[]>([]);
    const [selectedCriteriaIds, setSelectedCriteriaIds] = useState<number[]>([]);

    useEffect(() => {
        if (isOpen) {
            // Fetch evaluation cycles
            const fetchCycles = async () => {
                try {
                    const cycles = await evaluationCycleService.getAllEvaluationCycles(); // Hypothetical method
                    setAvailableCycles(cycles.map(c => ({ id: String(c.evaluationCycleId), name: `${c.startDate} - ${c.endDate}` })));
                } catch (error) {
                    toast.error('Không thể tải danh sách chu kỳ đánh giá');
                }
            };

            // Fetch evaluation criteria
            const fetchCriteria = async () => {
                try {
                    setCriteriaLoading(true);
                    const criteriaList = await evaluationCriteriaService.getAllEvaluationCriteria();
                    setAvailableCriteria(criteriaList.map(c => ({ id: c.evaluationCriteriaId, name: c.criteriaName })));
                } catch (error) {
                    toast.error('Không thể tải danh sách tiêu chí đánh giá');
                } finally {
                    setCriteriaLoading(false);
                }
            };

            fetchCycles();
            fetchCriteria();

            if (isEditMode && criteriaForm) {
                setFormData({
                    criteriaFormName: criteriaForm.criteriaFormName,
                    evaluationCycleId: criteriaForm.evaluationCycleId,
                    evaluationCriteriaIds: criteriaForm.evaluationCriteria?.map(c => c.evaluationCriteriaId) || [],
                });
                setSelectedCriteriaIds(criteriaForm.evaluationCriteria?.map(c => c.evaluationCriteriaId) || []);
            } else {
                setFormData({
                    criteriaFormName: '',
                    evaluationCycleId: String(cycleId), // Use provided cycleId
                    evaluationCriteriaIds: [],
                });
                setSelectedCriteriaIds([]);
            }
        }
    }, [isOpen, isEditMode, criteriaForm, cycleId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCriteriaChange = (id: number) => {
        setSelectedCriteriaIds(prev => {
            const newIds = prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id];
            setFormData(prev => ({ ...prev, evaluationCriteriaIds: newIds }));
            return newIds;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.criteriaFormName.trim()) {
            toast.error('Vui lòng nhập tên biểu mẫu');
            return;
        }
        if (formData.criteriaFormName.trim().length < 3) {
            toast.error('Tên biểu mẫu phải có ít nhất 3 ký tự');
            return;
        }
        if (!formData.evaluationCycleId.trim()) {
            toast.error('Vui lòng chọn chu kỳ đánh giá');
            return;
        }
        if (!availableCycles.some(cycle => cycle.id === formData.evaluationCycleId)) {
            toast.error('Chu kỳ đánh giá không hợp lệ');
            return;
        }
        if (formData.evaluationCriteriaIds.length === 0) {
            toast.error('Vui lòng chọn ít nhất một tiêu chí đánh giá');
            return;
        }

        try {
            setLoading(true);
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Save form error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {isEditMode ? 'Sửa biểu mẫu tiêu chí' : 'Thêm biểu mẫu tiêu chí mới'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Tên biểu mẫu *</label>
                        <input
                            type="text"
                            name="criteriaFormName"
                            value={formData.criteriaFormName}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên biểu mẫu (VD: Biểu mẫu đánh giá Q1)"
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">Ví dụ: Biểu mẫu đánh giá Q1, Biểu mẫu nhân viên mới</p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Chu kỳ đánh giá *</label>
                        <select
                            name="evaluationCycleId"
                            value={formData.evaluationCycleId}
                            onChange={handleInputChange}
                            disabled={isEditMode || !!cycleId} // Disable if in edit mode or cycleId is provided
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            required
                        >
                            <option value="">Chọn chu kỳ</option>
                            {availableCycles.map(cycle => (
                                <option key={cycle.id} value={cycle.id}>
                                    {cycle.name}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">Chọn chu kỳ đánh giá liên kết với biểu mẫu</p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Tiêu chí đánh giá *</label>
                        <div className="max-h-64 overflow-y-auto rounded-md border border-gray-200 p-4">
                            {criteriaLoading ? (
                                <div className="flex items-center justify-center py-4">
                                    <svg className="size-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="ml-2 text-sm text-gray-600">Đang tải tiêu chí...</span>
                                </div>
                            ) : availableCriteria.length === 0 ? (
                                <p className="text-sm text-gray-500">Không có tiêu chí nào để chọn</p>
                            ) : (
                                availableCriteria.map(criteria => (
                                    <div key={criteria.id} className="mb-2 flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`criteria-${criteria.id}`}
                                            checked={selectedCriteriaIds.includes(criteria.id)}
                                            onChange={() => handleCriteriaChange(criteria.id)}
                                            className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor={`criteria-${criteria.id}`} className="ml-2 text-sm text-gray-900">
                                            {criteria.name}
                                        </label>
                                    </div>
                                ))
                            )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Chọn ít nhất một tiêu chí để liên kết với biểu mẫu</p>
                    </div>

                    <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
                        <div className="flex">
                            <div className="shrink-0">
                                <svg className="size-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">Lưu ý về biểu mẫu tiêu chí</h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <ul className="list-inside list-disc space-y-1">
                                        <li>Tên biểu mẫu phải rõ ràng và liên quan đến chu kỳ đánh giá</li>
                                        <li>Chọn các tiêu chí phù hợp với mục đích đánh giá</li>
                                        <li>Biểu mẫu sẽ được sử dụng trong các chu kỳ đánh giá</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isEditMode && criteriaForm && (
                        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                            <h4 className="mb-3 text-sm font-medium text-gray-900">Thông tin hiện tại</h4>
                            <div className="space-y-3 text-sm text-gray-600">
                                <p><span className="font-medium">ID biểu mẫu:</span> {criteriaForm.criteriaFormId}</p>
                                <p><span className="font-medium">Số tiêu chí:</span> {criteriaForm.evaluationCriteria?.length || 0}</p>
                            </div>
                        </div>
                    )}

                    <div className="sticky bottom-0 -mx-6 -mb-6 flex justify-end space-x-3 border-t border-gray-200 bg-white px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading || criteriaLoading}
                            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
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

export default CriteriaFormModal;