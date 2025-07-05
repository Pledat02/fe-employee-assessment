import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { EvaluationQuestionResponse, EvaluationQuestionCreateRequest } from '../services/evaluationQuestionService';
import { EvaluationCriteriaResponse } from '../services/evaluationCriteriaService';

interface EvaluationQuestionFormModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  question?: EvaluationQuestionResponse | null;
  criteria: EvaluationCriteriaResponse[];
  onClose: () => void;
  onSave: (data: EvaluationQuestionCreateRequest) => Promise<void>;
}

const EvaluationQuestionFormModal: React.FC<EvaluationQuestionFormModalProps> = ({
  isOpen,
  isEditMode,
  question,
  criteria,
  onClose,
  onSave,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EvaluationQuestionCreateRequest>({
    questionName: '',
    maxScore: 10,
    evaluationCriteriaId: 0,
  });

  // Reset form when modal opens/closes or question changes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && question) {
        setFormData({
          questionName: question.questionName,
          maxScore: question.maxScore,
          evaluationCriteriaId: criteria.length === 1 ? criteria[0].evaluationCriteriaId : 0,
        });
      } else {
        // Reset form for add mode
        // If only one criteria is passed, pre-select it (when adding from criteria page)
        const defaultCriteriaId = criteria.length === 1 
          ? criteria[0].evaluationCriteriaId 
          : criteria.length > 0 ? criteria[0].evaluationCriteriaId : 0;
          
        setFormData({
          questionName: '',
          maxScore: 10,
          evaluationCriteriaId: defaultCriteriaId,
        });
      }
    }
  }, [isOpen, isEditMode, question, criteria]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxScore' || name === 'evaluationCriteriaId' 
        ? parseInt(value) || 0 
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.questionName.trim()) {
      toast.error('Vui lòng nhập nội dung câu hỏi');
      return;
    }

    if (formData.questionName.trim().length < 10) {
      toast.error('Nội dung câu hỏi phải có ít nhất 10 ký tự');
      return;
    }

    if (formData.maxScore <= 0) {
      toast.error('Điểm tối đa phải lớn hơn 0');
      return;
    }

    if (formData.maxScore > 100) {
      toast.error('Điểm tối đa không được vượt quá 100');
      return;
    }

    if (formData.evaluationCriteriaId === 0) {
      toast.error('Vui lòng chọn tiêu chí đánh giá');
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Save question error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditMode ? 'Sửa câu hỏi đánh giá' : 'Thêm câu hỏi đánh giá mới'}
            </h3>
            {!isEditMode && criteria.length === 1 && (
              <p className="text-sm text-gray-600 mt-1">
                Cho tiêu chí: <span className="font-medium text-blue-600">{criteria[0].criteriaName}</span>
              </p>
            )}
          </div>
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
          {/* Tiêu chí đánh giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu chí đánh giá *
            </label>
            <select
              name="evaluationCriteriaId"
              value={formData.evaluationCriteriaId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              disabled={criteria.length === 1}
            >
              <option value={0}>Chọn tiêu chí đánh giá</option>
              {criteria.map(criteriaItem => (
                <option key={criteriaItem.evaluationCriteriaId} value={criteriaItem.evaluationCriteriaId}>
                  {criteriaItem.criteriaName}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Câu hỏi này sẽ thuộc về tiêu chí đánh giá được chọn
            </p>
          </div>

          {/* Nội dung câu hỏi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung câu hỏi *
            </label>
            <textarea
              name="questionName"
              value={formData.questionName}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập nội dung câu hỏi đánh giá..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Ví dụ: "Nhân viên có nắm vững kiến thức chuyên môn không?"
            </p>
          </div>

          {/* Điểm tối đa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Điểm tối đa *
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                name="maxScore"
                value={formData.maxScore}
                onChange={handleInputChange}
                min="1"
                max="100"
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="text-sm text-gray-600">điểm</span>
              
              {/* Quick score buttons */}
              <div className="flex space-x-2">
                {[5, 10, 20, 50].map(score => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, maxScore: score }))}
                    className={`px-2 py-1 text-xs rounded border ${
                      formData.maxScore === score
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Điểm tối đa cho câu hỏi này (1-100 điểm)
            </p>
          </div>

          {/* Preview - chỉ hiển thị khi có nội dung */}
          {formData.questionName.trim() && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-green-900 mb-2">
                Xem trước
              </h4>
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">
                  {criteria.find(c => c.evaluationCriteriaId === formData.evaluationCriteriaId)?.criteriaName || 'Chưa chọn tiêu chí'}
                </p>
                <p className="mb-1">"{formData.questionName}"</p>
                <p className="text-xs">
                  Điểm tối đa: <span className="font-medium">{formData.maxScore} điểm</span>
                </p>
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

export default EvaluationQuestionFormModal;
