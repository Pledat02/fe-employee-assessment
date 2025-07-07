import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import MainLayout from './layout/MainLayout';

import EmployeeManagementNew from './pages/EmployeeManagementNew';
import DepartmentManagementNew from './pages/DepartmentManagementNew';
import Evaluation from './pages/Evaluation';
import Statistics from './pages/Statistics';
import EvaluationCriteriaManagement from './pages/EvaluationCriteriaManagement';

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
                    <Route path="/" element={<EmployeeManagementNew />} />
                    <Route path="/departments" element={<DepartmentManagementNew />} />
                    <Route path="/cycles" element={<EvaluationCycleManagement />} />
                    <Route path="/evaluation-form" element={<CriteriaFormManagement />} />
                    <Route path="/evaluation" element={<Evaluation />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/criteria" element={<EvaluationCriteriaManagement />} />
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