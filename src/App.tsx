import React from 'react';
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
import EvaluationCycleManagement from "./pages/EvaluationCycleManagement";
import CriteriaFormManagement from "./pages/EvaluationFormManagenment";

const App: React.FC = () => {
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