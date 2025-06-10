import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import EmployeeManagement from '../components/EmployeeManagement';
import DepartmentManagement from '../components/DepartmentManagement';
import Evaluation from '../components/Evaluation';
import Statistics from '../components/Statistics';
import AddEditEmployeeModal from '../components/AddEditEmployeeModal';

// Define interfaces consistent with AddEditEmployeeModal.tsx
interface Department {
  id: number;
  name: string;
}

// Allow optional fields for form editing
interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  avatar: string;
}

const  App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'departments' | 'evaluation' | 'statistics'>('employees');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Partial<Employee> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'NV001',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@company.com',
      phone: '0901234567',
      department: 'Phòng Nhân sự',
      position: 'Trưởng phòng',
      status: 'active',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20business%20man%20in%20suit%20with%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20realistic%2C%20detailed%20facial%20features&width=100&height=100&seq=1&orientation=squarish',
    },
    {
      id: 'NV002',
      name: 'Trần Thị B',
      email: 'tranthib@company.com',
      phone: '0912345678',
      department: 'Phòng Kế toán',
      position: 'Nhân viên',
      status: 'active',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20business%20woman%20with%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20realistic%2C%20detailed%20facial%20features&width=100&height=100&seq=2&orientation=squarish',
    },
    {
      id: 'NV003',
      name: 'Lê Văn C',
      email: 'levanc@company.com',
      phone: '0923456789',
      department: 'Phòng IT',
      position: 'Lập trình viên',
      status: 'active',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20young%20man%20with%20glasses%20in%20casual%20business%20attire%2C%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality&width=100&height=100&seq=3&orientation=squarish',
    },
    {
      id: 'NV004',
      name: 'Phạm Thị D',
      email: 'phamthid@company.com',
      phone: '0934567890',
      department: 'Phòng Marketing',
      position: 'Chuyên viên',
      status: 'inactive',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20business%20woman%20with%20long%20hair%2C%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20realistic%2C%20detailed%20facial%20features&width=100&height=100&seq=4&orientation=squarish',
    },
    {
      id: 'NV005',
      name: 'Hoàng Văn E',
      email: 'hoangvane@company.com',
      phone: '0945678901',
      department: 'Phòng Kinh doanh',
      position: 'Giám đốc kinh doanh',
      status: 'active',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20middle-aged%20business%20man%20in%20formal%20attire%2C%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20realistic&width=100&height=100&seq=5&orientation=squarish',
    },
    {
      id: 'NV006',
      name: 'Vũ Thị F',
      email: 'vuthif@company.com',
      phone: '0956789012',
      department: 'Phòng Nhân sự',
      position: 'Nhân viên',
      status: 'active',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20young%20woman%20with%20short%20hair%20in%20business%20casual%20attire%2C%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality&width=100&height=100&seq=6&orientation=squarish',
    },
    {
      id: 'NV007',
      name: 'Đặng Văn G',
      email: 'dangvang@company.com',
      phone: '0967890123',
      department: 'Phòng IT',
      position: 'Quản lý dự án',
      status: 'active',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20business%20man%20with%20casual%20style%2C%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20realistic%2C%20detailed%20facial%20features&width=100&height=100&seq=7&orientation=squarish',
    },
    {
      id: 'NV008',
      name: 'Bùi Thị H',
      email: 'buithih@company.com',
      phone: '0978901234',
      department: 'Phòng Kế toán',
      position: 'Kế toán trưởng',
      status: 'inactive',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20middle-aged%20business%20woman%20in%20formal%20attire%2C%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality&width=100&height=100&seq=8&orientation=squarish',
    },
  ]);
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

    // Validate required fields
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
      // Update existing employee
      setEmployees((prev) => prev.map((emp) => (emp.id === employee.id ? employee : emp)));
    } else {
      // Add new employee
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

     
            {activeTab === 'employees' && (
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
            )}
            {activeTab === 'departments' && <DepartmentManagement departments={departments} employees={employees} />}
            {activeTab === 'evaluation' && <Evaluation />}
            {activeTab === 'statistics' && <Statistics />}
          </div>
        </main>
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
      </div>
  );
};
export default App;
