import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { EvaluationCriteriaResponse, EvaluationCriteriaCreateRequest } from '../services/evaluationCriteriaService';

interface EvaluationCriteriaFormModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  criteria?: EvaluationCriteriaResponse | null;
  onClose: () => void;
  onSave: (data: EvaluationCriteriaCreateRequest) => Promise<void>;
}

const EvaluationCriteriaFormModal: React.FC<EvaluationCriteriaFormModalProps> = ({
  isOpen,
  isEditMode,
  criteria,
  onClose,
  onSave,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EvaluationCriteriaCreateRequest>({
    criteriaName: '',
  });

  // Reset form when modal opens/closes or criteria changes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && criteria) {
        setFormData({
          criteriaName: criteria.criteriaName,
        });
      } else {
        // Reset form for add mode
        setFormData({
          criteriaName: '',
        });
      }
    }
  }, [isOpen, isEditMode, criteria]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.criteriaName.trim()) {
      toast.error('Vui lòng nhập tên tiêu chí đánh giá');
      return;
    }

    if (formData.criteriaName.trim().length < 3) {
      toast.error('Tên tiêu chí đánh giá phải có ít nhất 3 ký tự');
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Save criteria error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Sửa tiêu chí đánh giá' : 'Thêm tiêu chí đánh giá mới'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tên tiêu chí */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên tiêu chí đánh giá *
            </label>
            <input
              type="text"
              name="criteriaName"
              value={formData.criteriaName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên tiêu chí đánh giá"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Ví dụ: Kỹ năng chuyên môn, Thái độ làm việc, Khả năng giao tiếp
            </p>
          </div>

          {/* Mô tả chi tiết */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả chi tiết
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mô tả chi tiết về tiêu chí đánh giá này..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Mô tả sẽ giúp người đánh giá hiểu rõ hơn về tiêu chí này
            </p>
          </div>

          {/* Thông tin bổ sung */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Lưu ý về tiêu chí đánh giá
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Tên tiêu chí phải rõ ràng và dễ hiểu</li>
                    <li>Sau khi tạo, bạn có thể thêm câu hỏi cho tiêu chí này</li>
                    <li>Tiêu chí sẽ được sử dụng trong các chu kỳ đánh giá</li>
                    <li>Nên tạo các tiêu chí theo từng khía cạnh công việc</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Hiển thị thông tin câu hỏi nếu đang edit */}
          {isEditMode && criteria && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Thông tin hiện tại
              </h4>
              <div className="text-sm text-gray-600 space-y-3">
                <p>
                  <span className="font-medium">ID tiêu chí:</span> {criteria.evaluationCriteriaId}
                </p>
                <p>
                  <span className="font-medium">Số câu hỏi:</span> {criteria.evaluationQuestions?.length || 0}
                </p>
                {criteria.evaluationQuestions && criteria.evaluationQuestions.length > 0 ? (
                  <div>
                    <span className="font-medium">Danh sách câu hỏi:</span>
                    <div className="mt-2 space-y-2">
                      {criteria.evaluationQuestions.map((question, index) => (
                        <div key={question.evaluationQuestionId || index} className="bg-white border border-gray-200 rounded p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Câu {index + 1}
                                </span>
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  {question.maxScore || 'N/A'} điểm
                                </span>
                              </div>
                              <p className="text-sm text-gray-900">
                                {question.questionName || question.questionText || 'Không có nội dung'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                      Chưa có câu hỏi nào cho tiêu chí này
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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

export default EvaluationCriteriaFormModal;
