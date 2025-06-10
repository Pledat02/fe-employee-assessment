import React from 'react';

const Statistics: React.FC = () => {
    return (
        <div>
            <div className="mb-6 overflow-hidden rounded-lg bg-white shadow">
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Thống kê đánh giá</h2>
                        <div className="mt-4 flex flex-col space-y-2 md:mt-0 md:flex-row md:space-x-4 md:space-y-0">
                            <select className="rounded-button block w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm md:w-auto">
                                <option>Quý 2/2025</option>
                                <option>Quý 1/2025</option>
                                <option>Năm 2024</option>
                            </select>
                            <select className="rounded-button block w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm md:w-auto">
                                <option>Tất cả phòng ban</option>
                                <option>Phòng Nhân sự</option>
                                <option>Phòng IT</option>
                                <option>Phòng Kế toán</option>
                                <option>Phòng Marketing</option>
                                <option>Phòng Kinh doanh</option>
                            </select>
                            <button className="rounded-button inline-flex cursor-pointer items-center whitespace-nowrap border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                <i className="fas fa-download mr-2"></i>
                                Xuất báo cáo
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="shrink-0 rounded-full bg-blue-100 p-3">
                                    <i className="fas fa-users text-xl text-blue-600"></i>
                                </div>
                                <div className="ml-5">
                                    <p className="text-sm font-medium text-gray-500">Tổng nhân viên</p>
                                    <h3 className="text-2xl font-bold text-gray-900">125</h3>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="shrink-0 rounded-full bg-green-100 p-3">
                                    <i className="fas fa-clipboard-check text-xl text-green-600"></i>
                                </div>
                                <div className="ml-5">
                                    <p className="text-sm font-medium text-gray-500">Đã đánh giá</p>
                                    <h3 className="text-2xl font-bold text-gray-900">112 <span className="text-sm font-normal text-gray-500">(90%)</span></h3>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="shrink-0 rounded-full bg-yellow-100 p-3">
                                    <i className="fas fa-star-half-alt text-xl text-yellow-600"></i>
                                </div>
                                <div className="ml-5">
                                    <p className="text-sm font-medium text-gray-500">Điểm trung bình</p>
                                    <h3 className="text-2xl font-bold text-gray-900">3.8/5</h3>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="shrink-0 rounded-full bg-purple-100 p-3">
                                    <i className="fas fa-trophy text-xl text-purple-600"></i>
                                </div>
                                <div className="ml-5">
                                    <p className="text-sm font-medium text-gray-500">Xuất sắc</p>
                                    <h3 className="text-2xl font-bold text-gray-900">23 <span className="text-sm font-normal text-gray-500">(18%)</span></h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">Biểu đồ hiệu suất</h3>
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                            <div id="performance-chart" style={{ width: '100%', height: '400px' }}></div>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-medium text-gray-900">Top nhân viên xuất sắc</h3>
                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Xếp hạng
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Nhân viên
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Phòng ban
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Điểm trung bình
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Xếp loại
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        So với kỳ trước
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                <tr>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex size-8 items-center justify-center rounded-full bg-yellow-100 text-sm font-bold text-yellow-800">1</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="size-10 shrink-0">
                                                <img
                                                    className="size-10 rounded-full object-cover"
                                                    src="https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20business%20man%20in%20suit%20with%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20realistic%2C%20detailed%20facial%20features&width=100&height=100&seq=1&orientation=squarish"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">Nguyễn Văn A</div>
                                                <div className="text-sm text-gray-500">Trưởng phòng</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm text-gray-900">Phòng Nhân sự</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">4.8</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Xuất sắc
                      </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <span className="text-green-600">
                        <i className="fas fa-arrow-up mr-1"></i>0.3
                      </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-800">2</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="size-10 shrink-0">
                                                <img
                                                    className="size-10 rounded-full object-cover"
                                                    src="https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20young%20man%20with%20glasses%20in%20casual%20business%20attire%2C%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality&width=100&height=100&seq=3&orientation=squarish"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">Lê Văn C</div>
                                                <div className="text-sm text-gray-500">Lập trình viên</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm text-gray-900">Phòng IT</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">4.7</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Xuất sắc
                      </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <span className="text-green-600">
                        <i className="fas fa-arrow-up mr-1"></i>0.5
                      </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex size-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-800">3</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="size-10 shrink-0">
                                                <img
                                                    className="size-10 rounded-full object-cover"
                                                    src="https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20middle-aged%20business%20man%20in%20formal%20attire%2C%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20realistic&width=100&height=100&seq=5&orientation=squarish"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">Hoàng Văn E</div>
                                                <div className="text-sm text-gray-500">Giám đốc kinh doanh</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm text-gray-900">Phòng Kinh doanh</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">4.6</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Xuất sắc
                      </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <span className="text-gray-500">
                        <i className="fas fa-minus mr-1"></i>0.0
                      </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-800">4</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="size-10 shrink-0">
                                                <img
                                                    className="size-10 rounded-full object-cover"
                                                    src="https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20business%20woman%20with%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20realistic%2C%20detailed%20facial%20features&width=100&height=100&seq=2&orientation=squarish"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">Trần Thị B</div>
                                                <div className="text-sm text-gray-500">Nhân viên</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm text-gray-900">Phòng Kế toán</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">4.5</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Xuất sắc
                      </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <span className="text-green-600">
                        <i className="fas fa-arrow-up mr-1"></i>0.2
                      </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-800">5</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="size-10 shrink-0">
                                                <img
                                                    className="size-10 rounded-full object-cover"
                                                    src="https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20business%20man%20with%20casual%20style%2C%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20realistic%2C%20detailed%20facial%20features&width=100&height=100&seq=7&orientation=squarish"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">Đặng Văn G</div>
                                                <div className="text-sm text-gray-500">Quản lý dự án</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm text-gray-900">Phòng IT</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">4.4</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Tốt
                      </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <span className="text-red-600">
                        <i className="fas fa-arrow-down mr-1"></i>0.1
                      </span>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;