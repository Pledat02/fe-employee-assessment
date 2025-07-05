import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
  departmentService, 
  DepartmentResponse, 
  DepartmentCreateRequest 
} from '../services/departmentService';

interface UseDepartmentsReturn {
  departments: DepartmentResponse[];
  loading: boolean;
  error: string | null;
  totalDepartments: number;
  refreshDepartments: () => Promise<void>;
  createDepartment: (request: DepartmentCreateRequest) => Promise<void>;
  updateDepartment: (id: number, request: DepartmentCreateRequest) => Promise<void>;
  deleteDepartment: (id: number) => Promise<void>;
  getDepartmentById: (id: number) => Promise<DepartmentResponse | null>;
  searchDepartments: (keyword: string) => Promise<void>;
}

export const useDepartments = (): UseDepartmentsReturn => {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalDepartments, setTotalDepartments] = useState<number>(0);

  // Fetch all departments
  const refreshDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const departmentList = await departmentService.getAllDepartments();
      
      setDepartments(departmentList);
      setTotalDepartments(departmentList.length);
      
      console.log('Departments loaded successfully:', departmentList.length);
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể tải danh sách phòng ban';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new department
  const createDepartment = useCallback(async (request: DepartmentCreateRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      await departmentService.createDepartment(request);
      toast.success('Tạo phòng ban thành công!');
      
      // Refresh the list
      await refreshDepartments();
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể tạo phòng ban';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshDepartments]);

  // Update department
  const updateDepartment = useCallback(async (id: number, request: DepartmentCreateRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      await departmentService.updateDepartment(id, request);
      toast.success('Cập nhật phòng ban thành công!');
      
      // Refresh the list
      await refreshDepartments();
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể cập nhật phòng ban';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshDepartments]);

  // Delete department
  const deleteDepartment = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await departmentService.deleteDepartment(id);
      toast.success('Xóa phòng ban thành công!');
      
      // Refresh the list
      await refreshDepartments();
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể xóa phòng ban';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshDepartments]);

  // Get department by ID
  const getDepartmentById = useCallback(async (id: number): Promise<DepartmentResponse | null> => {
    try {
      const department = await departmentService.getDepartmentById(id);
      return department;
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể lấy thông tin phòng ban';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Search departments
  const searchDepartments = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      await refreshDepartments();
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await departmentService.searchDepartments(keyword);
      
      setDepartments(searchResults);
      setTotalDepartments(searchResults.length);
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể tìm kiếm phòng ban';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [refreshDepartments]);

  // Load departments on mount
  useEffect(() => {
    refreshDepartments();
  }, [refreshDepartments]);

  return {
    departments,
    loading,
    error,
    totalDepartments,
    refreshDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentById,
    searchDepartments,
  };
};
