import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

interface CriteriaScore {
    criteria: string;
    averageScore: number;
}

interface Employee {
    employeeId: number;
    fullName: string;
}

interface EmployeeCriteriaScore {
    criteria: string;
    score: number;
}

const EvaluationChart: React.FC = () => {
    const [criteriaData, setCriteriaData] = useState<CriteriaScore[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeeScores, setEmployeeScores] = useState<EmployeeCriteriaScore[]>([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const queryParams = new URLSearchParams({
                    year: '2025', // hoặc `${new Date().getFullYear()}`
                    quarter: '2',
                    departmentId: '' // hoặc truyền đúng ID nếu có
                });

                const token = localStorage.getItem("token");

                const [criteriaRes, employeeRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/admin/statistics/criteria-average?${queryParams.toString()}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }),
                    axios.get('http://localhost:8080/api/admin/statistics/employees-evaluated', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    })
                ]);

                console.log("criteriaRes:", criteriaRes.data);
                console.log("employeeRes:", employeeRes.data);

                const criteriaList = Array.isArray(criteriaRes.data) ? criteriaRes.data : [];
                const employeeList = Array.isArray(employeeRes.data) ? employeeRes.data : [];

                setCriteriaData(criteriaList);
                setEmployees(employeeList);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu biểu đồ:", error);

                if (axios.isAxiosError(error)) {
                    console.error("Chi tiết lỗi Axios:", {
                        message: error.message,
                        url: error.config?.url,
                        method: error.config?.method,
                        status: error.response?.status,
                        data: error.response?.data
                    });
                }
                setCriteriaData([]);
                setEmployees([]);
            }
        };

        fetchData();
    }, []);

    const handleEmployeeSelect = async (id: number) => {
        setSelectedEmployeeId(id);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:8080/api/admin/statistics/employee/${id}/criteria-scores`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const scores = Array.isArray(res.data) ? res.data : [];
            setEmployeeScores(scores);
        } catch (error) {
            console.error("Lỗi khi tải điểm đánh giá cá nhân:", error);
            setEmployeeScores([]);
        }
    };

    const getRadarColor = (score: number): string => {
        if (score >= 4.5) return "#22c55e"; // Xanh lá
        if (score >= 3.5) return "#0ea5e9"; // Xanh dương
        return "#f97316"; // Cam
    };

    const avgScore = employeeScores.length > 0
        ? employeeScores.reduce((sum, s) => sum + s.score, 0) / employeeScores.length
        : 0;


    const radarColor = getRadarColor(avgScore);




    return (
        <div className="space-y-8">
            {/* Biểu đồ tổng thể */}
            <div>
                <h2 className="mb-4 text-lg font-semibold">Biểu đồ điểm trung bình theo tiêu chí</h2>
                <div style={{width: "100%", height: 400}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={criteriaData}>
                            <XAxis dataKey="criteria"/>
                            <YAxis domain={[0, 5]}/>
                            <Tooltip/>
                            <Bar dataKey="averageScore" fill="#8884d8"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Biểu đồ hiệu suất (placeholder) */}
            <div>
                <h2 className="mb-4 text-lg font-semibold">Biểu đồ hiệu suất</h2>
                <div className="rounded-lg border bg-white p-4 text-center text-gray-500 shadow">
                    Biểu đồ đang được cập nhật...
                </div>
            </div>

            {/* Chọn nhân viên */}
            <div>
                <label className="mb-1 block text-sm font-medium">Chọn nhân viên:</label>
                <select
                    onChange={(e) => handleEmployeeSelect(Number(e.target.value))}
                    className="rounded border px-4 py-2"
                >
                    <option value="">-- Chọn nhân viên --</option>
                    {employees.map((emp) => (
                        <option key={emp.employeeId} value={emp.employeeId}>
                            {emp.fullName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Biểu đồ cá nhân */}
            {selectedEmployeeId && employeeScores.length > 0 && (
                <div>
                    <h2 className="mb-2 text-lg font-semibold text-gray-800">Biểu đồ đánh giá cá nhân</h2>
                    <p className="mb-4 text-sm text-gray-500">
                        Nhân viên: <span className="font-medium text-gray-700">
                {employees.find(e => e.employeeId === selectedEmployeeId)?.fullName}
            </span>
                    </p>
                    <div style={{ width: "100%", height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius={150} data={employeeScores}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="criteria" />
                                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                                <Tooltip formatter={(value: number) => `${(value / 5 * 100).toFixed(0)}%`} />
                                <Radar
                                    name="Điểm số"
                                    dataKey="score"
                                    stroke={radarColor}
                                    fill={radarColor}
                                    fillOpacity={1}
                                />
                            </RadarChart>
                        </ResponsiveContainer>

                    </div>
                </div>
            )}


        </div>
    );
};

export default EvaluationChart;
