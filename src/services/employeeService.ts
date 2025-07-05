import axios from 'axios';

// Base URL for API
const API_BASE_URL = 'http://localhost:8080/api';

// Types matching backend response
export interface AccountInfo {
  id: number;
  username: string;
  role: string;
  status: string;
}

export interface DepartmentInfo {
  departmentId: number;
  departmentName: string;
  managerCode: string;
}

export interface EmployeeResponse {
  code: number;
  fullName: string;
  division: string;
  basic: string;
  staffType: string;
  startDate: string;
  type: string;
  account: AccountInfo;
  department: DepartmentInfo;
}

export interface EmployeeCreateRequest {
  fullName: string;
  division: string;
  basic: string;
  staffType: string;
  startDate: string;
  type: string;
  accountId: number;
  departmentId: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Employee Service Class
class EmployeeService {
  
  /**
   * Get all employees without pagination
   */
  async getAllEmployees(): Promise<EmployeeResponse[]> {
    try {
      const response = await axios.get<ApiResponse<EmployeeResponse[]>>(
        `${API_BASE_URL}/employees/all`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get employees:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy danh sách nhân viên'
      );
    }
  }

  /**
   * Get employees with pagination
   */
  async getEmployeesWithPagination(page: number = 0, size: number = 10): Promise<PageResponse<EmployeeResponse>> {
    try {
      const response = await axios.get<ApiResponse<PageResponse<EmployeeResponse>>>(
        `${API_BASE_URL}/employees`,
        {
          params: { page, size }
        }
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get employees with pagination:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy danh sách nhân viên'
      );
    }
  }

  /**
   * Get employee by code
   */
  async getEmployeeByCode(code: number): Promise<EmployeeResponse> {
    try {
      const response = await axios.get<ApiResponse<EmployeeResponse>>(
        `${API_BASE_URL}/employees/${code}`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get employee:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy thông tin nhân viên'
      );
    }
  }

  /**
   * Create new employee
   */
  async createEmployee(request: EmployeeCreateRequest): Promise<EmployeeResponse> {
    try {
      const response = await axios.post<ApiResponse<EmployeeResponse>>(
        `${API_BASE_URL}/employees`,
        request
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to create employee:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể tạo nhân viên mới'
      );
    }
  }

  /**
   * Update employee
   */
  async updateEmployee(code: number, request: EmployeeCreateRequest): Promise<EmployeeResponse> {
    try {
      const response = await axios.put<ApiResponse<EmployeeResponse>>(
        `${API_BASE_URL}/employees/${code}`,
        request
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to update employee:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể cập nhật nhân viên'
      );
    }
  }

  /**
   * Delete employee
   */
  async deleteEmployee(code: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/employees/${code}`);
    } catch (error: any) {
      console.error('Failed to delete employee:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể xóa nhân viên'
      );
    }
  }

  /**
   * Get employees by department
   */
  async getEmployeesByDepartment(departmentId: number): Promise<EmployeeResponse[]> {
    try {
      const response = await axios.get<ApiResponse<EmployeeResponse[]>>(
        `${API_BASE_URL}/employees/department/${departmentId}`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get employees by department:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy danh sách nhân viên theo phòng ban'
      );
    }
  }

  /**
   * Search employees by name
   */
  async searchEmployees(keyword: string): Promise<EmployeeResponse[]> {
    try {
      const response = await axios.get<ApiResponse<EmployeeResponse[]>>(
        `${API_BASE_URL}/employees/search`,
        {
          params: { keyword }
        }
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to search employees:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể tìm kiếm nhân viên'
      );
    }
  }

  /**
   * Get employees by department and staff type
   */
  async getEmployeesByDepartmentAndStaffType(departmentId: number, staffType: string): Promise<EmployeeResponse[]> {
    try {
      const response = await axios.get<ApiResponse<EmployeeResponse[]>>(
        `${API_BASE_URL}/employees/department/${departmentId}/staff-type/${staffType}`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get employees by department and staff type:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy danh sách nhân viên theo phòng ban và loại nhân viên'
      );
    }
  }
}

// Export singleton instance
export const employeeService = new EmployeeService();
export default employeeService;
