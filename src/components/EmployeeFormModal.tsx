import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { EmployeeResponse, EmployeeCreateRequest } from '../services/employeeService';
import { AccountCreateRequest, accountService } from '../services/accountService';
import { useDepartments } from '../hooks/useDepartments';

interface EmployeeFormModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  employee?: EmployeeResponse | null;
  onClose: () => void;
  onSave: (employeeData: EmployeeCreateRequest, accountData?: AccountCreateRequest) => Promise<void>;
}

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  isEditMode,
  employee,
  onClose,
  onSave,
}) => {
  const { departments, loading: departmentsLoading } = useDepartments();
  const [loading, setLoading] = useState(false);
  const [createAccount, setCreateAccount] = useState(true); // Default to create account
  const [formData, setFormData] = useState<EmployeeCreateRequest>({
    fullName: '',
    division: '',
    basic: '',
    staffType: '',
    startDate: '',
    type: '',
    accountId: 0,
    departmentId: 0,
  });
  const [accountData, setAccountData] = useState<AccountCreateRequest>({
    username: '',
    password: '',
    role: 'EMPLOYEE',
    status: 'ACTIVE',
  });

  // Reset form when modal opens/closes or employee changes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && employee) {
        setCreateAccount(false); // Don't create account when editing
        setFormData({
          fullName: employee.fullName,
          division: employee.division,
          basic: employee.basic,
          staffType: employee.staffType,
          startDate: employee.startDate,
          type: employee.type,
          accountId: employee.account.id,
          departmentId: employee.department.departmentId,
        });
        setAccountData({
          username: employee.account.username,
          password: '',
          role: employee.account.role,
          status: employee.account.status,
        });
      } else {
        // Reset form for add mode
        setCreateAccount(true);
        setFormData({
          fullName: '',
          division: '',
          basic: '',
          staffType: 'Nhân viên',
          startDate: new Date().toISOString().split('T')[0],
          type: 'Toàn thời gian',
          accountId: 0,
          departmentId: departments.length > 0 ? departments[0].departmentId : 0,
        });
        setAccountData({
          username: '',
          password: 'password123', // Default password
          role: 'EMPLOYEE',
          status: 'ACTIVE',
        });
      }
    }
  }, [isOpen, isEditMode, employee, departments]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'accountId' || name === 'departmentId' ? parseInt(value) || 0 : value,
    }));
  };

  const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAccountData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim()) {
      toast.error('Vui lòng nhập họ tên');
      return;
    }
    
    if (!formData.division.trim()) {
      toast.error('Vui lòng nhập bộ phận');
      return;
    }
    
    if (!formData.staffType.trim()) {
      toast.error('Vui lòng chọn chức vụ');
      return;
    }
    
    if (!formData.startDate) {
      toast.error('Vui lòng chọn ngày bắt đầu');
      return;
    }
    
    if (formData.departmentId === 0) {
      toast.error('Vui lòng chọn phòng ban');
      return;
    }

    // For add mode with account creation
    if (!isEditMode && createAccount) {
      if (!accountData.username.trim()) {
        toast.error('Vui lòng nhập tên đăng nhập');
        return;
      }
      if (!accountData.password.trim()) {
        toast.error('Vui lòng nhập mật khẩu');
        return;
      }
    }

    // For add mode without account creation, accountId is required
    if (!isEditMode && !createAccount && formData.accountId === 0) {
      toast.error('Vui lòng nhập ID tài khoản');
      return;
    }

    try {
      setLoading(true);
      await onSave(formData, createAccount ? accountData : undefined);
      onClose();
    } catch (error) {
      console.error('Save employee error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
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
          {/* Account Creation Toggle - only for add mode */}
          {!isEditMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="createAccount"
                  checked={createAccount}
                  onChange={(e) => setCreateAccount(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="createAccount" className="ml-2 block text-sm text-blue-900">
                  Tạo tài khoản mới cho nhân viên này
                </label>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                {createAccount
                  ? 'Hệ thống sẽ tự động tạo tài khoản mới với thông tin bên dưới'
                  : 'Sử dụng tài khoản đã có sẵn (nhập ID tài khoản)'
                }
              </p>
            </div>
          )}

          {/* Account Information - only show when creating account or editing */}
          {(createAccount || isEditMode) && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                {isEditMode ? 'Thông tin tài khoản' : 'Tạo tài khoản mới'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên đăng nhập *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={accountData.username}
                    onChange={handleAccountInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên đăng nhập"
                    required={createAccount}
                    disabled={isEditMode} // Can't change username when editing
                  />
                </div>

                {/* Password - only show when creating */}
                {!isEditMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={accountData.password}
                      onChange={handleAccountInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mật khẩu"
                      required={createAccount}
                    />
                  </div>
                )}

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vai trò *
                  </label>
                  <select
                    name="role"
                    value={accountData.role}
                    onChange={handleAccountInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={createAccount || isEditMode}
                  >
                    <option value="EMPLOYEE">Nhân viên</option>
                    <option value="SUPERVISOR">Giám sát</option>
                    <option value="MANAGER">Quản lý</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái *
                  </label>
                  <select
                    name="status"
                    value={accountData.status}
                    onChange={handleAccountInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={createAccount || isEditMode}
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Không hoạt động</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Họ tên */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            {/* Bộ phận */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bộ phận *
              </label>
              <input
                type="text"
                name="division"
                value={formData.division}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: Phát triển phần mềm"
                required
              />
            </div>

            {/* Trình độ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trình độ
              </label>
              <input
                type="text"
                name="basic"
                value={formData.basic}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: Cử nhân CNTT"
              />
            </div>

            {/* Chức vụ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chức vụ *
              </label>
              <select
                name="staffType"
                value={formData.staffType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn chức vụ</option>
                <option value="Quản lý">Quản lý</option>
                <option value="Giám sát">Giám sát</option>
                <option value="Nhân viên">Nhân viên</option>
                <option value="Thực tập sinh">Thực tập sinh</option>
              </select>
            </div>

            {/* Loại hình */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại hình làm việc *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn loại hình</option>
                <option value="Toàn thời gian">Toàn thời gian</option>
                <option value="Bán thời gian">Bán thời gian</option>
                <option value="Hợp đồng">Hợp đồng</option>
                <option value="Thực tập">Thực tập</option>
              </select>
            </div>

            {/* Ngày bắt đầu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bắt đầu *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Phòng ban */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phòng ban *
              </label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={departmentsLoading}
              >
                <option value={0}>Chọn phòng ban</option>
                {departments.map(dept => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>

            {/* Account ID - chỉ hiển thị khi thêm mới và không tạo account */}
            {!isEditMode && !createAccount && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Tài khoản *
                </label>
                <input
                  type="number"
                  name="accountId"
                  value={formData.accountId || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập ID tài khoản"
                  required
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ID của tài khoản đã tạo trước đó
                </p>
              </div>
            )}
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
              disabled={loading || departmentsLoading}
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

export default EmployeeFormModal;
