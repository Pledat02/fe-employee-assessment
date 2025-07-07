import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface DepartmentInfo {
    departmentId: number;
    departmentName: string;
    managerCode: string;
}

export interface EvaluationCycleResponse {
    evaluationCycleId: number;
    startDate: string;
    endDate: string;
    status: string;
    department?: DepartmentInfo;
}

export interface EvaluationCycleCreateRequest {
    departmentId: number;
    startDate: string;
    endDate: string;
    status: string;
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

class EvaluationCycleService {
    async getAllEvaluationCycles(): Promise<EvaluationCycleResponse[]> {
        try {
            const response = await axios.get<ApiResponse<EvaluationCycleResponse[]>>(
                `${API_BASE_URL}/evaluation-cycles/all`
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to get evaluation cycles:', error);
            throw new Error(
                error.response?.data?.message || 'Không thể lấy danh sách chu kỳ đánh giá'
            );
        }
    }

    async getEvaluationCyclesWithPagination(page: number = 0, size: number = 10): Promise<PageResponse<EvaluationCycleResponse>> {
        try {
            const response = await axios.get<ApiResponse<PageResponse<EvaluationCycleResponse>>>(
                `${API_BASE_URL}/evaluation-cycles`,
                {
                    params: { page, size }
                }
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to get evaluation cycles with pagination:', error);
            throw new Error(
                error.response?.data?.message || 'Không thể lấy danh sách chu kỳ đánh giá'
            );
        }
    }

    async getEvaluationCycleById(id: number): Promise<EvaluationCycleResponse> {
        try {
            const response = await axios.get<ApiResponse<EvaluationCycleResponse>>(
                `${API_BASE_URL}/evaluation-cycles/${id}`
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to get evaluation cycle:', error);
            throw new Error(
                error.response?.data?.message || 'Không thể lấy thông tin chu kỳ đánh giá'
            );
        }
    }

    async createEvaluationCycle(request: EvaluationCycleCreateRequest): Promise<EvaluationCycleResponse> {
        try {
            const response = await axios.post<ApiResponse<EvaluationCycleResponse>>(
                `${API_BASE_URL}/evaluation-cycles`,
                request
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to create evaluation cycle:', error);
            throw new Error(
                error.response?.data?.message || 'Không thể tạo chu kỳ đánh giá mới'
            );
        }
    }

    async updateEvaluationCycle(id: number, request: EvaluationCycleCreateRequest): Promise<EvaluationCycleResponse> {
        try {
            const response = await axios.put<ApiResponse<EvaluationCycleResponse>>(
                `${API_BASE_URL}/evaluation-cycles/${id}`,
                request
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to update evaluation cycle:', error);
            throw new Error(
                error.response?.data?.message || 'Không thể cập nhật chu kỳ đánh giá'
            );
        }
    }

    async updateEvaluationCycleStatus(id: number, status: string): Promise<EvaluationCycleResponse> {
        try {
            const response = await axios.put<ApiResponse<EvaluationCycleResponse>>(
                `${API_BASE_URL}/evaluation-cycles/${id}/status`,
                null,
                { params: { status } }
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to update evaluation cycle status:', error);
            throw new Error(
                error.response?.data?.message || 'Không thể cập nhật trạng thái chu kỳ đánh giá'
            );
        }
    }

    async deleteEvaluationCycle(id: number): Promise<void> {
        try {
            await axios.delete(`${API_BASE_URL}/evaluation-cycles/${id}`);
        } catch (error: any) {
            console.error('Failed to delete evaluation cycle:', error);
            throw new Error(
                error.response?.data?.message || 'Không thể xóa chu kỳ đánh giá'
            );
        }
    }

    async getEvaluationCyclesByDepartment(departmentId: number): Promise<EvaluationCycleResponse[]> {
        try {
            const response = await axios.get<ApiResponse<EvaluationCycleResponse[]>>(
                `${API_BASE_URL}/evaluation-cycles/department/${departmentId}`
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to get evaluation cycles by department:', error);
            throw new Error(
                error.response?.data?.message || 'Không thể lấy chu kỳ đánh giá theo phòng ban'
            );
        }
    }

    async getEvaluationCyclesByStatus(status: string): Promise<EvaluationCycleResponse[]> {
        try {
            const response = await axios.get<ApiResponse<EvaluationCycleResponse[]>>(
                `${API_BASE_URL}/evaluation-cycles/status/${encodeURIComponent(status)}`
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to get evaluation cycles by status:', error);
            throw new Error(
                error.response?.data?.message || 'Không thể lấy chu kỳ đánh giá theo trạng thái'
            );
        }
    }

    async getActiveEvaluationCycles(): Promise<EvaluationCycleResponse[]> {
        try {
            const response = await axios.get<ApiResponse<EvaluationCycleResponse[]>>(
                `${API_BASE_URL}/evaluation-cycles/active`
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to get active evaluation cycles:', error);
            throw new Error(
                error.response?.data?.message || 'Không thể lấy chu kỳ đánh giá đang hoạt động'
            );
        }
    }

    async getActiveCyclesByDepartment(departmentId: number): Promise<EvaluationCycleResponse[]> {
        try {
            const response = await axios.get<ApiResponse<EvaluationCycleResponse[]>>(
                `${API_BASE_URL}/evaluation-cycles/department/${departmentId}/active`
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to get active evaluation cycles by department:', error);
            throw new Error(
                error.response?.data?.message || 'Không thể lấy chu kỳ đánh giá đang hoạt động theo phòng ban'
            );
        }
    }

    async searchEvaluationCycles(keyword: string): Promise<EvaluationCycleResponse[]> {
        try {
            const response = await axios.get<ApiResponse<EvaluationCycleResponse[]>>(
                `${API_BASE_URL}/evaluation-cycles/search`,
                {
                    params: { keyword }
                }
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to search evaluation cycles:', error);
            throw new Error(
                error.response?.data?.message || 'Không thể tìm kiếm chu kỳ đánh giá'
            );
        }
    }
}

export const evaluationCycleService = new EvaluationCycleService();
export default evaluationCycleService;