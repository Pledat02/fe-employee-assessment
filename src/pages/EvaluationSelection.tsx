import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { evaluationCycleService, EvaluationCycleResponse } from '../services/evaluationCycleService';
import { criteriaFormService, CriteriaFormResponse } from '../services/criteriaFormService';
import { employeeService, EmployeeResponse } from '../services/employeeService';

interface User {
    id: number;
    username: string;
    role: 'EMPLOYEE' | 'SUPERVISOR' | 'MANAGER';
    status: string;
    employee: {
        code: number;
        fullName: string;
        departmentName: string;
        staffType: string;
    };
}

interface Assessor {
    id: number;
    fullName: string;
    role: 'EMPLOYEE' | 'SUPERVISOR' | 'MANAGER';
    departmentName: string;
}

const EvaluationSelection: React.FC = () => {
    const navigate = useNavigate();
    const [cycles, setCycles] = useState<EvaluationCycleResponse[]>([]);
    const [selectedCycle, setSelectedCycle] = useState<number | null>(null);
    const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
    const [forms, setForms] = useState<CriteriaFormResponse[]>([]);
    const [selectedForm, setSelectedForm] = useState<number | null>(null);
    const [selectionError, setSelectionError] = useState<string | null>(null);
    const [isSelectionLoading, setIsSelectionLoading] = useState<boolean>(false);
    const [assessor, setAssessor] = useState<Assessor | null>(null);

    // Fetch cycles and assessor on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsSelectionLoading(true);
            setSelectionError(null);
            try {
                const userData = localStorage.getItem('user_info');
                if (!userData) {
                    throw new Error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
                }
                const user: User = JSON.parse(userData);
                if (!user.id || !user.employee?.fullName || !['EMPLOYEE', 'SUPERVISOR', 'MANAGER'].includes(user.role)) {
                    throw new Error('Thông tin người dùng không hợp lệ hoặc vai trò không được hỗ trợ.');
                }
                setAssessor({
                    id: user.id,
                    fullName: user.employee.fullName,
                    role: user.role,
                    departmentName: user.employee.departmentName,
                });

                const cycleResponse = await evaluationCycleService.getActiveEvaluationCycles();
                setCycles(cycleResponse);
            } catch (err: any) {
                setSelectionError(err.message || 'Không thể tải dữ liệu chu kỳ hoặc thông tin người dùng');
            } finally {
                setIsSelectionLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Fetch forms and employees when cycle changes
    useEffect(() => {
        if (selectedCycle) {
            const fetchData = async () => {
                setIsSelectionLoading(true);
                setSelectionError(null);
                try {
                    const [formResponse, selectedCycleData] = await Promise.all([
                        criteriaFormService.getCriteriaFormsByEvaluationCycleId(selectedCycle),
                        evaluationCycleService.getEvaluationCycleById(selectedCycle),
                    ]);
                    setForms(formResponse);
                    setSelectedForm(null);
                    setSelectedEmployee(null);

                    if (selectedCycleData?.department?.departmentId) {
                        try {
                            const employeeResponse = await employeeService.getEmployeesByDepartment(
                                selectedCycleData.department.departmentId
                            );
                            setEmployees(employeeResponse);
                            if (employeeResponse.length === 0) {
                                setSelectionError('Không có nhân viên nào trong phòng ban của chu kỳ này');
                            }
                        } catch (err: any) {
                            setSelectionError(err.message || 'Không thể tải danh sách nhân viên');
                        }
                    } else {
                        setEmployees([]);
                        setSelectionError('Chu kỳ này không được liên kết với phòng ban');
                    }
                } catch (err: any) {
                    setSelectionError(err.message || 'Không thể tải biểu mẫu hoặc thông tin chu kỳ');
                } finally {
                    setIsSelectionLoading(false);
                }
            };
            fetchData();
        } else {
            setForms([]);
            setEmployees([]);
            setSelectedForm(null);
            setSelectedEmployee(null);
        }
    }, [selectedCycle]);

    // Handle proceed to evaluation
    const handleProceed = () => {
        if (selectedCycle && selectedForm && selectedEmployee && assessor) {
            navigate('/evaluation', {
                state: {
                    selectedCycle,
                    selectedForm,
                    selectedEmployee,
                    assessor,
                    employees,
                    cycles,
                    forms,
                },
            });
        } else {
            setSelectionError('Vui lòng chọn đầy đủ chu kỳ, biểu mẫu và nhân viên.');
        }
    };

    return (
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Chọn thông tin đánh giá</h2>
            {isSelectionLoading && (
                <div className="flex items-center justify-center py-4">
                    <svg className="size-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-600">Đang tải...</span>
                </div>
            )}
            {selectionError && <p className="text-sm text-red-500">{selectionError}</p>}
            {!assessor && <p className="text-sm text-red-500">Vui lòng đăng nhập để tiếp tục</p>}

            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Chu kỳ đánh giá *</label>
                <select
                    value={selectedCycle || ''}
                    onChange={e => setSelectedCycle(Number(e.target.value) || null)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!assessor}
                >
                    <option value="">Chọn chu kỳ</option>
                    {cycles.map(cycle => (
                        <option key={cycle.evaluationCycleId} value={cycle.evaluationCycleId}>
                            {cycle.startDate} - {cycle.endDate} ({cycle.department?.departmentName || 'No Department'})
                        </option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">Chọn chu kỳ đánh giá để xem các biểu mẫu và nhân viên</p>
            </div>

            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Biểu mẫu đánh giá *</label>
                <select
                    value={selectedForm || ''}
                    onChange={e => setSelectedForm(Number(e.target.value) || null)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!selectedCycle}
                >
                    <option value="">Chọn biểu mẫu</option>
                    {forms.map(form => (
                        <option key={form.criteriaFormId} value={form.criteriaFormId}>
                            {form.criteriaFormName}
                        </option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">Chọn biểu mẫu liên kết với chu kỳ</p>
            </div>

            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Nhân viên *</label>
                <select
                    value={selectedEmployee || ''}
                    onChange={e => setSelectedEmployee(Number(e.target.value) || null)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!selectedCycle || employees.length === 0}
                >
                    <option value="">Chọn nhân viên</option>
                    {employees.map(emp => (
                        <option key={emp.code} value={emp.code}>
                            {emp.fullName}
                        </option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                    {employees.length === 0 && selectedCycle
                        ? 'Không có nhân viên nào trong phòng ban của chu kỳ này'
                        : 'Chọn nhân viên để đánh giá'}
                </p>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleProceed}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSelectionLoading || !selectedCycle || !selectedForm || !selectedEmployee}
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
};

export default EvaluationSelection;