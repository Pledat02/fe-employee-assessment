import React, { useState, useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import EmployeeManagement from './pages/EmployeeManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import Evaluation from './pages/Evaluation';
import Statistics from './pages/Statistics';
import AddEditEmployeeModal from './components/AddEditEmployeeModal';
import './App.css';
import employeesData from './data/employees.json'; // Import JSON file

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
  const [activeTab, setActiveTab] = useState<'employees' | 'departments' | 'evaluation' | 'statistics'>('employees');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Partial<Employee> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(employeesData);
  const [departments] = useState<Department[]>([
    { id: 1, name: 'Phòng Nhân sự' },
    { id: 2, name: 'Phòng Kế toán' },
    { id: 3, name: 'Phòng IT' },
    { id: 4, name: 'Phòng Marketing' },
    { id: 5, name: 'Phòng Kinh doanh' },
  ]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  const handleAddEmployee = () => {
    setIsEditMode(false);
    setSelectedEmployee({
      id: '',
      name: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      status: 'active',
      avatar: '',
    });
    setShowAddEmployeeModal(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setIsEditMode(true);
    setSelectedEmployee({ ...employee });
    setShowAddEmployeeModal(true);
  };

  const handleCloseModal = () => {
    setShowAddEmployeeModal(false);
    setSelectedEmployee(null);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    const requiredFields: (keyof Employee)[] = ['id', 'name', 'email', 'department', 'position', 'status'];
    const isValid = requiredFields.every((field) => selectedEmployee[field]);
    if (!isValid) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    const employee: Employee = {
      id: selectedEmployee.id || `NV${(employees.length + 1).toString().padStart(3, '0')}`,
      name: selectedEmployee.name || '',
      email: selectedEmployee.email || '',
      phone: selectedEmployee.phone || '',
      department: selectedEmployee.department || '',
      position: selectedEmployee.position || '',
      status: selectedEmployee.status || 'active',
      avatar: selectedEmployee.avatar || '',
    };

    if (isEditMode) {
      setEmployees((prev) => prev.map((emp) => (emp.id === employee.id ? employee : emp)));
    } else {
      setEmployees((prev) => [...prev, employee]);
    }
    handleCloseModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({
      ...(prev || { id: '', name: '', email: '', phone: '', department: '', position: '', status: 'active', avatar: '' }),
      [name]: value,
    }));
  };

  return (
      <BrowserRouter>
        <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          <Routes>
            <Route
                path="/"
                element={
                  <EmployeeManagement
                      employees={filteredEmployees}
                      departments={departments}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      departmentFilter={departmentFilter}
                      setDepartmentFilter={setDepartmentFilter}
                      statusFilter={statusFilter}
                      setStatusFilter={setStatusFilter}
                      handleAddEmployee={handleAddEmployee}
                      handleEditEmployee={handleEditEmployee}
                      totalEmployees={employees.length}
                  />
                }
            />
            <Route
                path="/departments"
                element={<DepartmentManagement departments={departments} employees={employees} />}
            />
            <Route path="/evaluation" element={<Evaluation />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
          {showAddEmployeeModal && (
              <AddEditEmployeeModal
                  isEditMode={isEditMode}
                  selectedEmployee={selectedEmployee}
                  departments={departments}
                  handleInputChange={handleInputChange}
                  handleSaveEmployee={handleSaveEmployee}
                  handleCloseModal={handleCloseModal}
              />
          )}
        </MainLayout>
      </BrowserRouter>
  );
};

export default App;