import React from 'react';

const Evaluation: React.FC = () => {
  return (
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 flex items-center md:mb-0">
              <img
                  className="size-12 rounded-full object-cover"
                  src="https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20business%20man%20in%20suit%20with%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20realistic%2C%20detailed%20facial%20features&width=100&height=100&seq=1&orientation=squarish"
                  alt=""
              />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Nguyễn Văn A</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Trưởng phòng</span>
                  <span className="mx-2">•</span>
                  <span>Phòng Nhân sự</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0">
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-500">Kỳ đánh giá:</span>
                <select className="rounded-button block w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm md:w-auto">
                  <option>Quý 2/2025</option>
                  <option>Quý 1/2025</option>
                  <option>Quý 4/2024</option>
                </select>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-500">Người đánh giá:</span>
                <span className="text-sm font-medium text-gray-900">Lê Thị Quản lý</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex space-x-8">
            <button className="cursor-pointer whitespace-nowrap border-b-2 border-blue-600 px-1 pb-4 text-sm font-medium text-blue-600">
              KPIs & Mục tiêu
            </button>
            <button className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:text-gray-700">
              Năng lực
            </button>
            <button className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:text-gray-700">
              Nhận xét & Đề xuất
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Đánh giá KPIs & Mục tiêu</h3>
            <div className="mb-4 rounded-lg bg-gray-50 p-4">
              <p className="mb-2 text-sm text-gray-600">
                <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                Hướng dẫn: Đánh giá mức độ hoàn thành KPI của nhân viên theo thang điểm từ 1-5.
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Thang điểm:</span> 1 - Không đạt, 2 - Cần cải thiện, 3 - Đạt yêu cầu, 4 - Tốt, 5 - Xuất sắc
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-2/5 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    KPI
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Mục tiêu
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Kết quả thực hiện
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Điểm (1-5)
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Trọng số
                  </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">Tuyển dụng nhân sự</div>
                    <div className="text-sm text-gray-500">Hoàn thành kế hoạch tuyển dụng quý</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">10 nhân sự mới</div>
                  </td>
                  <td className="px-6 py-4">
                    <input
                        type="text"
                        className="rounded-button block w-full border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder="Nhập kết quả"
                        defaultValue="12 nhân sự mới"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <select className="rounded-button block w-20 cursor-pointer border border-gray-300 bg-white px-3 py-2 text-center shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option selected>5</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-center text-sm text-gray-900">30%</div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">Đào tạo nhân viên mới</div>
                    <div className="text-sm text-gray-500">Tỷ lệ nhân viên mới vượt qua thử việc</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">80%</div>
                  </td>
                  <td className="px-6 py-4">
                    <input
                        type="text"
                        className="rounded-button block w-full border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder="Nhập kết quả"
                        defaultValue="75%"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <select className="rounded-button block w-20 cursor-pointer border border-gray-300 bg-white px-3 py-2 text-center shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option selected>4</option>
                        <option>5</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-center text-sm text-gray-900">25%</div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">Xây dựng chính sách nhân sự</div>
                    <div className="text-sm text-gray-500">Hoàn thiện quy trình đánh giá nhân viên</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">100% quy trình được phê duyệt</div>
                  </td>
                  <td className="px-6 py-4">
                    <input
                        type="text"
                        className="rounded-button block w-full border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder="Nhập kết quả"
                        defaultValue="95% quy trình được phê duyệt"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <select className="rounded-button block w-20 cursor-pointer border border-gray-300 bg-white px-3 py-2 text-center shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option selected>4</option>
                        <option>5</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-center text-sm text-gray-900">20%</div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">Tăng cường văn hóa doanh nghiệp</div>
                    <div className="text-sm text-gray-500">Tổ chức sự kiện gắn kết nhân viên</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">3 sự kiện/quý</div>
                  </td>
                  <td className="px-6 py-4">
                    <input
                        type="text"
                        className="rounded-button block w-full border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder="Nhập kết quả"
                        defaultValue="4 sự kiện"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <select className="rounded-button block w-20 cursor-pointer border border-gray-300 bg-white px-3 py-2 text-center shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option selected>5</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-center text-sm text-gray-900">25%</div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Evaluation;