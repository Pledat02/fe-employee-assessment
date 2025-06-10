import React, { useState, useMemo } from 'react';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  avatar: string;
}

interface Department {
  id: number;
  name: string;
}

interface EmployeeManagementProps {
  employees: Employee[];
  departments: Department[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (filter: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  handleAddEmployee: () => void;
  handleEditEmployee: (employee: Employee) => void;
  totalEmployees: number;
  handleDeleteEmployee?: (id: string) => void; // Optional prop for delete
  handleEvaluateEmployee?: (employee: Employee) => void; // Optional prop for evaluation
}

const ITEMS_PER_PAGE = 10;

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({
  employees,
  departments,
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  handleAddEmployee,
  handleEditEmployee,
  totalEmployees,
  handleDeleteEmployee,
  handleEvaluateEmployee,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Paginate employees
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return employees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [employees, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(employees.length / ITEMS_PER_PAGE);

  // Handle export to Excel (placeholder)
  const handleExportExcel = () => {
    alert('Export Excel functionality to be implemented');
    // Example: Use library like xlsx to generate Excel file
    // import XLSX from 'xlsx';
    // const worksheet = XLSX.utils.json_to_sheet(employees);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    // XLSX.write_file(workbook, 'employees.xlsx');
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium ${
            currentPage === i ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'
          } cursor-pointer`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div>
      <div className="rounded-lg bg-white px-4 py-5 shadow sm:px-6">
        <div className="mb-4 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div className="mb-4 flex flex-col space-y-3 md:mb-0 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <button
              onClick={handleAddEmployee}
              className="rounded-button inline-flex cursor-pointer items-center whitespace-nowrap border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Thêm nhân viên mới"
            >
              <i className="fas fa-plus mr-2"></i>
              Thêm nhân viên
            </button>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <i className="fas fa-search text-gray-400" aria-hidden="true"></i>
              </div>
              <input
                type="text"
                className="rounded-button block w-full border border-gray-300 py-2 pl-10 pr-3 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Tìm theo tên/mã nhân viên"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Tìm kiếm nhân viên"
              />
            </div>
          </div>
          <div className="flex w-full flex-col space-y-3 md:w-auto md:flex-row md:space-x-4 md:space-y-0">
            <select
              className="rounded-button block w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm md:w-48"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              aria-label="Lọc theo phòng ban"
            >
              <option value="all">Tất cả phòng ban</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
            <select
              className="rounded-button block w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm md:w-40"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Lọc theo trạng thái"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang làm việc</option>
              <option value="inactive">Ngừng làm việc</option>
            </select>
            <button
              onClick={handleExportExcel}
              className="rounded-button inline-flex cursor-pointer items-center whitespace-nowrap border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Xuất danh sách nhân viên ra Excel"
            >
              <i className="fas fa-download mr-2"></i>
              Xuất Excel
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Nhân viên
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Số điện thoại
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Phòng ban
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Chức vụ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Tác vụ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="size-10 shrink-0">
                        <img
                          className="size-10 rounded-full object-cover"
                          src={employee.avatar}
                          alt={`Ảnh đại diện của ${employee.name}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{employee.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{employee.phone}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{employee.department}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{employee.position}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {employee.status === 'active' ? 'Đang làm việc' : 'Ngừng làm việc'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditEmployee(employee)}
                      className="mr-3 cursor-pointer text-blue-600 hover:text-blue-900"
                      aria-label={`Chỉnh sửa nhân viên ${employee.name}`}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    {handleDeleteEmployee && (
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="mr-3 cursor-pointer text-red-600 hover:text-red-900"
                        aria-label={`Xóa nhân viên ${employee.name}`}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    )}
                    {handleEvaluateEmployee && (
                      <button
                        onClick={() => handleEvaluateEmployee(employee)}
                        className="cursor-pointer text-green-600 hover:text-green-900"
                        aria-label={`Đánh giá nhân viên ${employee.name}`}
                      >
                        <i className="fas fa-clipboard-check"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedEmployees.length === 0 && (
          <div className="py-10 text-center">
            <i className="fas fa-search mb-4 text-5xl text-gray-400" aria-hidden="true"></i>
            <p className="text-gray-500">Không tìm thấy nhân viên phù hợp với điều kiện tìm kiếm</p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">{paginatedEmployees.length}</span> /{' '}
            <span className="font-medium">{totalEmployees}</span> nhân viên
          </div>
          <div className="flex flex-1 justify-end">
            <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex cursor-pointer items-center rounded-l-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                aria-label="Trang trước"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              {renderPagination()}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex cursor-pointer items-center rounded-r-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                aria-label="Trang sau"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;