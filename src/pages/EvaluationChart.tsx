import React, { useEffect, useState } from "react";
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
    averageScore: number;
    maxScore: number;
}

interface EvaluationChartProps {
    cycleId: number | null;
}

const EvaluationChart: React.FC<EvaluationChartProps> = ({ cycleId }) => {
    const [criteriaData, setCriteriaData] = useState<CriteriaScore[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeeScores, setEmployeeScores] = useState<EmployeeCriteriaScore[]>([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!cycleId) {
                setError("Không có chu kỳ được chọn");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("auth_token");
                if (!token) {
                    throw new Error("Vui lòng đăng nhập để xem dữ liệu");
                }
                const [criteriaRes, employeeRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/admin/statistics/criteria-average/${cycleId}`, {
    headers: { Authorization: `Bearer ${token}` },
}),
axios.get('http://localhost:8080/api/admin/statistics/employees-evaluated', {
    headers: { Authorization: `Bearer ${token}` },
    params: { cycleId },
}),
]);

console.log("Criteria Response:", criteriaRes.data);
console.log("Employees Response:", employeeRes.data);

const criteriaList = Array.isArray(criteriaRes.data) ? criteriaRes.data : [];
const employeeList = Array.isArray(employeeRes.data) ? employeeRes.data : [];

const normalizedCriteriaList = criteriaList.map(item => ({
    criteria: item.criteria,
    averageScore:item.averageScore
}));

setCriteriaData(normalizedCriteriaList);
setEmployees(employeeList);
} catch (error) {
    console.error("Lỗi khi tải dữ liệu biểu đồ:", error);
    if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Lỗi khi tải dữ liệu biểu đồ");
    } else {
        setError("Lỗi không xác định khi tải dữ liệu");
    }
    setCriteriaData([]);
    setEmployees([]);
} finally {
    setLoading(false);
}
};

fetchData();
}, [cycleId]);

const handleEmployeeSelect = async (id: number) => {
    setSelectedEmployeeId(id);
    setEmployeeScores([]); // Clear previous scores during loading
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Vui lòng đăng nhập để xem dữ liệu");
        }
        console.log(`Fetching scores for employee ${id} with cycleId ${cycleId}`);
        const res = await axios.get(`http://localhost:8080/api/admin/statistics/employee/${id}/criteria-scores`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { cycleId },
        });
        console.log("Employee Scores Response:", res.data);
        const scores = Array.isArray(res.data) ? res.data.map(item => ({
            criteria: item.criteria,
            averageScore: (item.averageScore / item.maxScore) * 5, // Chuẩn hóa về 0-5
            maxScore: item.maxScore,
        })) : [];
        if (scores.length === 0) {
            throw new Error("Không có dữ liệu đánh giá cho nhân viên này");
        }
        setEmployeeScores(scores);
    } catch (error) {
        console.error("Lỗi khi tải điểm đánh giá cá nhân:", error);
        if (axios.isAxiosError(error)) {
            console.error("Chi tiết lỗi Axios:", error.response?.data);
        }
        setEmployeeScores([]);
    }
};

const getRadarColor = (score: number): string => {
    if (score >= 4.5) return "#22c55e"; // Xanh lá
    if (score >= 3.5) return "#0ea5e9"; // Xanh dương
    return "#f97316"; // Cam
};

const avgScore = employeeScores.length > 0
    ? employeeScores.reduce((sum, s) => sum + s.averageScore, 0) / employeeScores.length
    : 0;

const radarColor = getRadarColor(avgScore);

if (loading) {
    return <div className="text-center text-gray-500">Đang tải dữ liệu...</div>;
}

if (error) {
    return <div className="text-center text-red-500">{error}</div>;
}

return (
    <div className="space-y-8">
        {/* Biểu đồ điểm trung bình theo tiêu chí */}
        {criteriaData.length > 0 ? (
            <div>
                <h2 className="mb-4 text-lg font-semibold">Biểu đồ điểm trung bình theo tiêu chí</h2>
                <div style={{ width: "100%", height: 400, border: "1px solid #e5e7eb" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={criteriaData}>
                            <XAxis dataKey="criteria" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip formatter={(value: number) => `${value.toFixed(1)}`} />
                            <Bar dataKey="averageScore" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        ) : (
            <div className="text-center text-gray-500">Không có dữ liệu điểm trung bình cho chu kỳ này</div>
        )}

        {/* Chọn nhân viên */}
        <div>
            <label className="mb-1 block text-sm font-medium">Chọn nhân viên:</label>
            <select
                onChange={(e) => handleEmployeeSelect(Number(e.target.value))}
                className="rounded border px-4 py-2"
                value={selectedEmployeeId || ""}
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
        {selectedEmployeeId && employeeScores.length > 0 ? (
            <div>
                <h2 className="mb-2 text-lg font-semibold text-gray-800">Biểu đồ đánh giá cá nhân</h2>
                <p className="mb-4 text-sm text-gray-500">
                    Nhân viên: <span className="font-medium text-gray-700">
                            {employees.find((e) => e.employeeId === selectedEmployeeId)?.fullName}
                        </span>
                </p>
                <div style={{ width: "100%", height: 400, border: "1px solid #e5e7eb" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius={150} data={employeeScores}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="criteria" />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} />
                            <Tooltip formatter={(value: number) => `${(value / 5 * 100).toFixed(0)}%`} />
                            <Radar
                                name="Điểm số"
                                dataKey="averageScore"
                                stroke={radarColor}
                                fill={radarColor}
                                fillOpacity={0.6}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        ) : selectedEmployeeId ? (
            <div className="text-center text-gray-500">Không có dữ liệu đánh giá cho nhân viên này</div>
        ) : null}
    </div>
);
};

export default EvaluationChart;