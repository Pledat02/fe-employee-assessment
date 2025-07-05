import axios from 'axios';

// Base URL for API
const API_BASE_URL = 'http://localhost:8080/api';

// Types matching backend response
export interface EmployeeInfo {
  code: number;
  fullName: string;
  division: string;
  staffType: string;
  type: string;
}

export interface EvaluationCycleInfo {
  evaluationCycleId: number;
  startDate: string;
  endDate: string;
  status: string;
}

export interface DepartmentResponse {
  departmentId: number;
  departmentName: string;
  managerCode: string;
  employees?: EmployeeInfo[];
  evaluationCycles?: EvaluationCycleInfo[];
}

export interface DepartmentCreateRequest {
  departmentName: string;
  managerCode: string;
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

// Department Service Class
class DepartmentService {
  
  /**
   * Get all departments without pagination
   */
  async getAllDepartments(): Promise<DepartmentResponse[]> {
    try {
      const response = await axios.get<ApiResponse<DepartmentResponse[]>>(
        `${API_BASE_URL}/departments/all`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get departments:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy danh sách phòng ban'
      );
    }
  }

  /**
   * Get departments with pagination
   */
  async getDepartmentsWithPagination(page: number = 0, size: number = 10): Promise<PageResponse<DepartmentResponse>> {
    try {
      const response = await axios.get<ApiResponse<PageResponse<DepartmentResponse>>>(
        `${API_BASE_URL}/departments`,
        {
          params: { page, size }
        }
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get departments with pagination:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy danh sách phòng ban'
      );
    }
  }

  /**
   * Get department by ID
   */
  async getDepartmentById(id: number): Promise<DepartmentResponse> {
    try {
      const response = await axios.get<ApiResponse<DepartmentResponse>>(
        `${API_BASE_URL}/departments/${id}`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get department:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy thông tin phòng ban'
      );
    }
  }

  /**
   * Get department by name
   */
  async getDepartmentByName(name: string): Promise<DepartmentResponse> {
    try {
      const response = await axios.get<ApiResponse<DepartmentResponse>>(
        `${API_BASE_URL}/departments/name/${encodeURIComponent(name)}`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get department by name:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể tìm phòng ban theo tên'
      );
    }
  }

  /**
   * Create new department
   */
  async createDepartment(request: DepartmentCreateRequest): Promise<DepartmentResponse> {
    try {
      const response = await axios.post<ApiResponse<DepartmentResponse>>(
        `${API_BASE_URL}/departments`,
        request
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to create department:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể tạo phòng ban mới'
      );
    }
  }

  /**
   * Update department
   */
  async updateDepartment(id: number, request: DepartmentCreateRequest): Promise<DepartmentResponse> {
    try {
      const response = await axios.put<ApiResponse<DepartmentResponse>>(
        `${API_BASE_URL}/departments/${id}`,
        request
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to update department:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể cập nhật phòng ban'
      );
    }
  }

  /**
   * Delete department
   */
  async deleteDepartment(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/departments/${id}`);
    } catch (error: any) {
      console.error('Failed to delete department:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể xóa phòng ban'
      );
    }
  }

  /**
   * Get department with employees
   */
  async getDepartmentWithEmployees(id: number): Promise<DepartmentResponse> {
    try {
      const response = await axios.get<ApiResponse<DepartmentResponse>>(
        `${API_BASE_URL}/departments/${id}/employees`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get department with employees:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy thông tin phòng ban và nhân viên'
      );
    }
  }

  /**
   * Get department with evaluation cycles
   */
  async getDepartmentWithEvaluationCycles(id: number): Promise<DepartmentResponse> {
    try {
      const response = await axios.get<ApiResponse<DepartmentResponse>>(
        `${API_BASE_URL}/departments/${id}/evaluation-cycles`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get department with evaluation cycles:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy thông tin phòng ban và chu kỳ đánh giá'
      );
    }
  }

  /**
   * Search departments by name
   */
  async searchDepartments(keyword: string): Promise<DepartmentResponse[]> {
    try {
      const response = await axios.get<ApiResponse<DepartmentResponse[]>>(
        `${API_BASE_URL}/departments/search`,
        {
          params: { keyword }
        }
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to search departments:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể tìm kiếm phòng ban'
      );
    }
  }

  /**
   * Get department by manager code
   */
  async getDepartmentByManagerCode(managerCode: string): Promise<DepartmentResponse> {
    try {
      const response = await axios.get<ApiResponse<DepartmentResponse>>(
        `${API_BASE_URL}/departments/manager/${encodeURIComponent(managerCode)}`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get department by manager code:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể tìm phòng ban theo mã quản lý'
      );
    }
  }
}

// Export singleton instance
export const departmentService = new DepartmentService();
export default departmentService;
