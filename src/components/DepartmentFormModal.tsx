import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { DepartmentResponse, DepartmentCreateRequest } from '../services/departmentService';

interface DepartmentFormModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  department?: DepartmentResponse | null;
  onClose: () => void;
  onSave: (data: DepartmentCreateRequest) => Promise<void>;
}

const DepartmentFormModal: React.FC<DepartmentFormModalProps> = ({
  isOpen,
  isEditMode,
  department,
  onClose,
  onSave,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DepartmentCreateRequest>({
    departmentName: '',
    managerCode: '',
  });

  // Reset form when modal opens/closes or department changes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && department) {
        setFormData({
          departmentName: department.departmentName,
          managerCode: department.managerCode,
        });
      } else {
        // Reset form for add mode
        setFormData({
          departmentName: '',
          managerCode: '',
        });
      }
    }
  }, [isOpen, isEditMode, department]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.departmentName.trim()) {
      toast.error('Vui lòng nhập tên phòng ban');
      return;
    }
    
    if (!formData.managerCode.trim()) {
      toast.error('Vui lòng nhập mã quản lý');
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Save department error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Sửa thông tin phòng ban' : 'Thêm phòng ban mới'}
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
          {/* Tên phòng ban */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên phòng ban *
            </label>
            <input
              type="text"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên phòng ban"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Ví dụ: Phòng Công nghệ thông tin, Phòng Nhân sự
            </p>
          </div>

          {/* Mã quản lý */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã quản lý *
            </label>
            <input
              type="text"
              name="managerCode"
              value={formData.managerCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mã quản lý"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Mã nhân viên của người quản lý phòng ban này
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
                  Lưu ý
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Tên phòng ban phải là duy nhất trong hệ thống</li>
                    <li>Mã quản lý phải tương ứng với mã nhân viên có vai trò quản lý</li>
                    <li>Sau khi tạo, bạn có thể gán nhân viên vào phòng ban này</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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

export default DepartmentFormModal;
