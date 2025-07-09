import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import Login from './pages/Login';
import MainLayout from './layout/MainLayout';
import { ROLES } from './hooks/useRoleAccess';

import EmployeeManagementNew from './pages/EmployeeManagementNew';
import DepartmentManagementNew from './pages/DepartmentManagementNew';
import Evaluation from './pages/Evaluation';
import Statistics from './pages/Statistics';
import EvaluationCriteriaManagement from './pages/EvaluationCriteriaManagement';
import EvaluationHistory from './pages/EvaluationHistory';

import './App.css';
import employeesData from './data/employees.json';
import EvaluationCycleManagement from "./pages/EvaluationCycleManagement";
import CriteriaFormManagement from "./pages/EvaluationFormManagenment";


// Types for legacy compatibility
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

interface Department {
  id: number;
  name: string;
}

// Define interfaces
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

const App: React.FC = () => {
  // Temporarily use static data until we fully integrate the API
  const [employees, setEmployees] = useState<Employee[]>(employeesData);
  const totalEmployees = employees.length;

  // Simplified state - không cần state này nữa vì EmployeeManagementNew tự quản lý

  // Static departments for now - you can create a similar hook for departments
  const [departments] = useState<Department[]>([
    { id: 1, name: 'Phòng Công nghệ thông tin' },
    { id: 2, name: 'Phòng Nhân sự' },
    { id: 3, name: 'Phòng Kế toán' },
    { id: 4, name: 'Phòng Marketing' },
    { id: 5, name: 'Phòng Kinh doanh' },
  ]);

  // Xóa filteredEmployees vì không dùng nữa

  // Xóa các handlers cũ vì đã có EmployeeManagementNew

  return (
    <AuthProvider>
      <BrowserRouter>
        <>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    {/* MANAGER only - Quản lý nhân viên */}
                    <Route path="/" element={
                      <RoleBasedRoute allowedRoles={[ROLES.MANAGER]}>
                        <EmployeeManagementNew />
                      </RoleBasedRoute>
                    } />

                    {/* MANAGER only - Quản lý phòng ban */}
                    <Route path="/departments" element={
                      <RoleBasedRoute allowedRoles={[ROLES.MANAGER]}>
                        <DepartmentManagementNew />
                      </RoleBasedRoute>
                    } />

                    {/* SUPERVISOR + MANAGER - Quản lý chu kì */}
                    <Route path="/cycles" element={
                      <RoleBasedRoute allowedRoles={[ROLES.SUPERVISOR, ROLES.MANAGER]}>
                        <EvaluationCycleManagement />
                      </RoleBasedRoute>
                    } />

                    {/* SUPERVISOR + MANAGER - Quản lý form */}
                    <Route path="/evaluation-form" element={
                      <RoleBasedRoute allowedRoles={[ROLES.SUPERVISOR, ROLES.MANAGER]}>
                        <CriteriaFormManagement />
                      </RoleBasedRoute>
                    } />

                    {/* SUPERVISOR + MANAGER - Tiêu chí & câu hỏi */}
                    <Route path="/criteria" element={
                      <RoleBasedRoute allowedRoles={[ROLES.SUPERVISOR, ROLES.MANAGER]}>
                        <EvaluationCriteriaManagement />
                      </RoleBasedRoute>
                    } />

                    {/* ALL ROLES - Đánh giá nhân viên */}
                    <Route path="/evaluation" element={
                      <RoleBasedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.SUPERVISOR, ROLES.MANAGER]}>
                        <Evaluation />
                      </RoleBasedRoute>
                    } />

                    {/* SUPERVISOR + MANAGER - Thống kê */}
                    <Route path="/statistics" element={
                      <RoleBasedRoute allowedRoles={[ROLES.SUPERVISOR, ROLES.MANAGER]}>
                        <Statistics />
                      </RoleBasedRoute>
                    } />

                    {/* ALL ROLES - Lịch sử đánh giá */}
                    <Route path="/evaluation-history" element={
                      <RoleBasedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.SUPERVISOR, ROLES.MANAGER]}>
                        <EvaluationHistory />
                      </RoleBasedRoute>
                    } />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          </Routes>

          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;