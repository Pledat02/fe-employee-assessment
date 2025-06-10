import React from 'react';

interface Department {
  id: number;
  name: string;
}

interface Employee {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  status?: 'active' | 'inactive';
  avatar?: string;
}

interface AddEditEmployeeModalProps {
  isEditMode: boolean;
  selectedEmployee: Employee | null;
  departments: Department[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSaveEmployee: (e: React.FormEvent) => void;
  handleCloseModal: () => void;
}

const AddEditEmployeeModal: React.FC<AddEditEmployeeModalProps> = ({
  isEditMode,
  selectedEmployee,
  departments,
  handleInputChange,
  handleSaveEmployee,
  handleCloseModal,
}) => {
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true"></span>
        <div className="inline-block overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:align-middle">
          <form onSubmit={handleSaveEmployee}>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="mb-4 border-b border-gray-200">
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  {isEditMode ? 'Chỉnh sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
                </h3>
                <div className="flex border-b border-gray-200">
                  <button
                    type="button"
                    className="cursor-pointer whitespace-nowrap border-b-2 border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 focus:outline-none"
                    aria-current="page"
                  >
                    Thông tin cá nhân
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:outline-none"
                    disabled // Placeholder for future implementation
                  >
                    Thông tin công việc
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:outline-none"
                    disabled // Placeholder for future implementation
                  >
                    Phân quyền
                  </button>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="col-span-1 flex flex-col items-center">
                  <div className="mb-4 size-32 overflow-hidden rounded-full bg-gray-200">
                    {selectedEmployee?.avatar ? (
                      <img src={selectedEmployee.avatar} alt="Avatar" className="size-full object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <i className="fas fa-user text-5xl text-gray-400"></i>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="rounded-button inline-flex cursor-pointer items-center whitespace-nowrap border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => alert('Avatar upload functionality to be implemented')} // Placeholder
                    aria-label="Tải ảnh đại diện lên"
                  >
                    <i className="fas fa-upload mr-2"></i>
                    Tải ảnh lên
                  </button>
                </div>

                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="id" className="mb-1 block text-sm font-medium text-gray-700">
                      Mã nhân viên
                    </label>
                    <input
                      type="text"
                      name="id"
                      id="id"
                      className="rounded-button block w-full border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      value={selectedEmployee?.id ?? ''}
                      onChange={handleInputChange}
                      placeholder="Nhập mã nhân viên"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="rounded-button block w-full border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      value={selectedEmployee?.name ?? ''}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="rounded-button block w-full border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      value={selectedEmployee?.email ?? ''}
                      onChange={handleInputChange}
                      placeholder="Nhập email"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      className="rounded-button block w-full border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      value={selectedEmployee?.phone ?? ''}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div>
                    <label htmlFor="department" className="mb-1 block text-sm font-medium text-gray-700">
                      Phòng ban
                    </label>
                    <select
                      id="department"
                      name="department"
                      className="rounded-button block w-full cursor-pointer border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      value={selectedEmployee?.department ?? ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn phòng ban</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="position" className="mb-1 block text-sm font-medium text-gray-700">
                      Chức vụ
                    </label>
                    <input
                      type="text"
                      name="position"
                      id="position"
                      className="rounded-button block w-full border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      value={selectedEmployee?.position ?? ''}
                      onChange={handleInputChange}
                      placeholder="Nhập chức vụ"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                      Trạng thái
                    </label>
                    <select
                      id="status"
                      name="status"
                      className="rounded-button block w-full cursor-pointer border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      value={selectedEmployee?.status ?? 'active'}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="active">Đang làm việc</option>
                      <option value="inactive">Ngừng làm việc</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                className="rounded-button inline-flex w-full cursor-pointer justify-center whitespace-nowrap border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isEditMode ? 'Cập nhật' : 'Thêm mới'}
              </button>
              <button
                type="button"
                className="rounded-button mt-3 inline-flex w-full cursor-pointer justify-center whitespace-nowrap border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={handleCloseModal}
                aria-label="Hủy thao tác"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditEmployeeModal;
