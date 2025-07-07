import React, { useEffect, useState } from 'react';
import axios from "axios";
import EvaluationChart from "./EvaluationChart";

interface EvaluationStatisticsResponse {
    totalEmployees: number;
    evaluatedEmployees: number;
    averageScore: number;
    excellentEmployees: number;
}

interface TopEmployee {
    rank: number;
    fullName: string;
    position: string;
    department: string;
    averageScore: number;
    classification: string;
    scoreDiffFromLast: number;
    avatarUrl: string | null;
}

const Statistics: React.FC = () => {
    const [stats, setStats] = useState<EvaluationStatisticsResponse | null>(null);
    const [topEmployees, setTopEmployees] = useState<TopEmployee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [overviewRes, topEmpRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/admin/statistics/overview'),
                    axios.get('http://localhost:8080/api/admin/statistics/top-employees'),
                ]);
                setStats(overviewRes.data);
                setTopEmployees(topEmpRes.data);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu thống kê:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading || !stats) {
        return (
            <div className="flex h-96 items-center justify-center">
                <p className="text-lg text-gray-600">Đang tải dữ liệu thống kê...</p>
            </div>
        );
    }

    const evaluatedPercent = stats.totalEmployees > 0
        ? Math.round((stats.evaluatedEmployees / stats.totalEmployees) * 100)
        : 0;

    const excellentPercent = stats.totalEmployees > 0
        ? Math.round((stats.excellentEmployees / stats.totalEmployees) * 100)
        : 0;

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
                    {/* Tổng quan thống kê */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
                        {[
                            {
                                icon: 'fas fa-users text-blue-600',
                                bg: 'bg-blue-100',
                                label: 'Tổng nhân viên',
                                value: stats.totalEmployees
                            },
                            {
                                icon: 'fas fa-clipboard-check text-green-600',
                                bg: 'bg-green-100',
                                label: 'Đã đánh giá',
                                value: `${stats.evaluatedEmployees} (${evaluatedPercent}%)`
                            },
                            {
                                icon: 'fas fa-star-half-alt text-yellow-600',
                                bg: 'bg-yellow-100',
                                label: 'Điểm trung bình',
                                value: `${stats.averageScore.toFixed(1)}/5`
                            },
                            {
                                icon: 'fas fa-trophy text-purple-600',
                                bg: 'bg-purple-100',
                                label: 'Xuất sắc',
                                value: `${stats.excellentEmployees} (${excellentPercent}%)`
                            }
                        ].map((item, index) => (
                            <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center">
                                    <div className={`shrink-0 rounded-full ${item.bg} p-3`}>
                                        <i className={`${item.icon} text-xl`}></i>
                                    </div>
                                    <div className="ml-5">
                                        <p className="text-sm font-medium text-gray-500">{item.label}</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{item.value}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Biểu đồ hiệu suất */}
                    <EvaluationChart/>

                    {/* Bảng top nhân viên */}
                    {topEmployees.length > 0 ? (
                        <div>
                            <h3 className="mb-4 text-lg font-medium text-gray-900">Top nhân viên xuất sắc</h3>
                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Xếp
                                            hạng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nhân
                                            viên
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Phòng
                                            ban
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Điểm
                                            trung bình
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Xếp
                                            loại
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">So
                                            với kỳ trước
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {topEmployees.map((emp) => (
                                        <tr key={emp.rank}>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div
                                                    className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${
                                                        emp.rank === 1
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : emp.rank === 2
                                                                ? 'bg-gray-100 text-gray-800'
                                                                : emp.rank === 3
                                                                    ? 'bg-orange-100 text-orange-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>{emp.rank}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="size-10 shrink-0">
                                                        <img
                                                            className="size-10 rounded-full object-cover"
                                                            src={emp.avatarUrl || "https://via.placeholder.com/100"}
                                                            alt={emp.fullName}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div
                                                            className="text-sm font-medium text-gray-900">{emp.fullName}</div>
                                                        <div className="text-sm text-gray-500">{emp.position}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{emp.department}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{emp.averageScore.toFixed(1)}</td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                            <span
                                                className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold text-green-800">
                                                {emp.classification}
                                            </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                {emp.scoreDiffFromLast > 0 ? (
                                                    <span className="text-green-600">
                                                    <i className="fas fa-arrow-up mr-1"></i>{emp.scoreDiffFromLast.toFixed(1)}
                                                </span>
                                                ) : emp.scoreDiffFromLast < 0 ? (
                                                    <span className="text-red-600">
                                                    <i className="fas fa-arrow-down mr-1"></i>{Math.abs(emp.scoreDiffFromLast).toFixed(1)}
                                                </span>
                                                ) : (
                                                    <span className="text-gray-500">
                                                    <i className="fas fa-minus mr-1"></i>0.0
                                                </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <p className="italic text-gray-600">Chưa có dữ liệu nhân viên xuất sắc trong kỳ đánh giá hiện
                            tại.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Statistics;
