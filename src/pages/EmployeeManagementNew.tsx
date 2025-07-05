import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { employeeService, EmployeeResponse, EmployeeCreateRequest } from '../services/employeeService';
import { AccountCreateRequest, accountService } from '../services/accountService';
import { useDepartments } from '../hooks/useDepartments';
import EmployeeFormModal from '../components/EmployeeFormModal';

const ITEMS_PER_PAGE = 10;

const EmployeeManagementNew: React.FC = () => {
  // State management
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<number | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Get departments for filter dropdown
  const { departments } = useDepartments();

  // Load employees on component mount
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      console.log('Employees loaded:', data.length);
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể tải danh sách nhân viên';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filter employees based on search and filters
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.account?.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = departmentFilter === 'all' || 
                               employee.department?.departmentId.toString() === departmentFilter;
      
      const matchesStatus = statusFilter === 'all' || 
                           employee.account?.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handlers
  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsEditMode(false);
    setShowAddEmployeeModal(true);
  };

  const handleEditEmployee = (employee: EmployeeResponse) => {
    setSelectedEmployee(employee);
    setIsEditMode(true);
    setShowAddEmployeeModal(true);
  };

  const handleSaveEmployee = async (employeeData: EmployeeCreateRequest, accountData?: AccountCreateRequest) => {
    try {
      if (isEditMode && selectedEmployee) {
        // Update existing employee
        await employeeService.updateEmployee(selectedEmployee.code, employeeData);

        // Update account if provided
        if (accountData) {
          await accountService.updateAccount(selectedEmployee.account.id, accountData);
        }

        // Update local state
        setEmployees(prevEmployees =>
          prevEmployees.map(emp =>
            emp.code === selectedEmployee.code
              ? {
                  ...emp,
                  ...employeeData,
                  department: departments.find(d => d.departmentId === employeeData.departmentId)!,
                  account: accountData ? { ...emp.account, ...accountData } : emp.account
                }
              : emp
          )
        );

        toast.success('Cập nhật nhân viên thành công!');
      } else {
        // Create new employee
        let finalEmployeeData = employeeData;

        if (accountData) {
          // Create account first
          const newAccount = await accountService.createAccount(accountData);
          finalEmployeeData = { ...employeeData, accountId: newAccount.id };

          toast.success('Tạo tài khoản thành công!');
        }

        // Create employee
        const newEmployee = await employeeService.createEmployee(finalEmployeeData);

        // Add to local state
        setEmployees(prevEmployees => [...prevEmployees, newEmployee]);

        toast.success('Thêm nhân viên thành công!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi lưu nhân viên');
      throw error; // Re-throw to let modal handle loading state
    }
  };

  const handleDeleteEmployee = async (code: number, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa nhân viên "${name}"?`)) {
      try {
        // Set loading state cho button cụ thể
        setDeletingEmployeeId(code);

        await employeeService.deleteEmployee(code);

        // Cập nhật state local thay vì reload từ API
        setEmployees(prevEmployees => {
          const newEmployees = prevEmployees.filter(emp => emp.code !== code);

          // Tính toán lại pagination sau khi xóa
          const newFilteredCount = newEmployees.filter(employee => {
            const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 employee.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 employee.account?.username.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesDepartment = departmentFilter === 'all' ||
                                     employee.department?.departmentId.toString() === departmentFilter;

            const matchesStatus = statusFilter === 'all' ||
                                 employee.account?.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesDepartment && matchesStatus;
          }).length;

          const newTotalPages = Math.ceil(newFilteredCount / ITEMS_PER_PAGE);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(1);
          }

          return newEmployees;
        });

        toast.success(`Đã xóa nhân viên "${name}" thành công!`);

      } catch (err: any) {
        toast.error(err.message || 'Không thể xóa nhân viên');
        console.error('Delete employee error:', err);
      } finally {
        setDeletingEmployeeId(null);
      }
    }
  };

  const handleRefresh = () => {
    loadEmployees();
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
    
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'INACTIVE':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getRoleBadge = (role: string) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
    
    switch (role?.toUpperCase()) {
      case 'MANAGER':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'SUPERVISOR':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'EMPLOYEE':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý nhân viên</h1>
              <p className="text-sm text-gray-600 mt-1">
                Tổng số: {filteredEmployees.length} nhân viên
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Đang tải...' : 'Làm mới'}
              </button>
              <button
                onClick={handleAddEmployee}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm nhân viên
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm
              </label>
              <input
                type="text"
                placeholder="Tên, phòng ban, username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phòng ban
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả phòng ban</option>
                {departments.map(dept => (
                  <option key={dept.departmentId} value={dept.departmentId.toString()}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDepartmentFilter('all');
                  setStatusFilter('all');
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <strong>Lỗi:</strong> {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Đang tải...</span>
          </div>
        )}

        {/* Employee Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhân viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phòng ban
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chức vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedEmployees.map((employee) => (
                  <tr key={employee.code} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee.fullName)}&background=random`}
                            alt={employee.fullName}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{employee.account?.username} • #{employee.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.department?.departmentName || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.division}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.staffType}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getRoleBadge(employee.account?.role || '')}>
                        {employee.account?.role || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(employee.account?.status || '')}>
                        {employee.account?.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          disabled={deletingEmployeeId === employee.code}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.code, employee.fullName)}
                          disabled={deletingEmployeeId === employee.code}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {deletingEmployeeId === employee.code ? (
                            <>
                              <svg className="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Đang xóa...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Empty State */}
        {!loading && filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có nhân viên</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || departmentFilter !== 'all' || statusFilter !== 'all' 
                ? 'Không tìm thấy nhân viên phù hợp với bộ lọc.'
                : 'Chưa có nhân viên nào trong hệ thống.'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredEmployees.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredEmployees.length)} 
                trong tổng số {filteredEmployees.length} nhân viên
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Trước
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Employee Modal */}
      <EmployeeFormModal
        isOpen={showAddEmployeeModal}
        isEditMode={isEditMode}
        employee={selectedEmployee}
        onClose={() => {
          setShowAddEmployeeModal(false);
          setSelectedEmployee(null);
          setIsEditMode(false);
        }}
        onSave={handleSaveEmployee}
      />
    </div>
  );
};

export default EmployeeManagementNew;
