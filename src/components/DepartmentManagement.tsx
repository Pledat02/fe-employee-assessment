import React from 'react';

interface Department {
  id: number;
  name: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: string;
  avatar: string;
}

interface DepartmentManagementProps {
  departments: Department[];
  employees: Employee[];
}

const DepartmentManagement: React.FC<DepartmentManagementProps> = ({ departments, employees }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="flex h-[calc(100vh-160px)] min-h-[600px]">
        <div className="w-1/3 border-r border-gray-200 bg-gray-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Phòng ban</h2>
              <button className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                <i className="fas fa-plus"></i>
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-button shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tìm kiếm phòng ban"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-73px)]">
            <ul className="divide-y divide-gray-200">
              {departments.map((dept) => (
                <li key={dept.id} className="px-4 py-3 hover:bg-blue-50 cursor-pointer">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <i className="fas fa-building text-blue-600"></i>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                      <p className="text-sm text-gray-500">Mã: PB00{dept.id}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-2/3 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <i className="fas fa-building text-blue-600 text-2xl"></i>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">Phòng Nhân sự</h2>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500">Mã phòng: PB001</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">6 nhân viên</span>
                </div>
              </div>
              <div className="ml-auto">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-button text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap cursor-pointer">
                  <i className="fas fa-edit mr-2"></i>
                  Chỉnh sửa
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Trưởng phòng</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src="https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20business%20man%20in%20suit%20with%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20realistic%2C%20detailed%20facial%20features&width=100&height=100&seq=1&orientation=squarish"
                    alt=""
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Nguyễn Văn A</p>
                    <p className="text-sm text-gray-500">nguyenvana@company.com</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Trưởng phòng
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Mô tả công việc</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Phòng Nhân sự chịu trách nhiệm quản lý nguồn nhân lực, tuyển dụng, đào tạo và phát triển nhân viên. 
                    Phòng có nhiệm vụ xây dựng chính sách nhân sự, đánh giá hiệu suất làm việc và đảm bảo môi trường làm việc tích cực.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Danh sách nhân viên</h3>
                  <div className="flex">
                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-button text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap cursor-pointer">
                      <i className="fas fa-plus mr-1"></i>
                      Thêm nhân viên
                    </button>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nhân viên
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chức vụ
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tác vụ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employees.filter(e => e.department === 'Phòng Nhân sự').map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full object-cover" src={employee.avatar} alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                <div className="text-sm text-gray-500">{employee.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{employee.position}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {employee.status === 'active' ? 'Đang làm việc' : 'Ngừng làm việc'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer">
                              <i className="fas fa-user-edit"></i>
                            </button>
                            <button className="text-red-600 hover:text-red-900 cursor-pointer">
                              <i className="fas fa-user-minus"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;