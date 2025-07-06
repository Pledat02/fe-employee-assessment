import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface EvaluationCriteriaInfo {
    evaluationCriteriaId: number;
    criteriaName: string;
}

export interface CriteriaFormResponse {
    criteriaFormId: number;
    evaluationCycleId: string;
    criteriaFormName: string;
    evaluationCriteria?: EvaluationCriteriaInfo[];
}

export interface CriteriaFormCreateRequest {
    criteriaFormName: string;
    evaluationCycleId: string;
    evaluationCriteriaIds: number[];
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

class CriteriaFormService {
    async getAllCriteriaForms(): Promise<CriteriaFormResponse[]> {
        try {
            const response = await axios.get<ApiResponse<CriteriaFormResponse[]>>(`${API_BASE_URL}/criteria-forms/all`);
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to get criteria forms:', error);
            throw new Error(error.response?.data?.message || 'Không thể lấy danh sách biểu mẫu');
        }
    }

    async getCriteriaFormsWithPagination(page: number = 0, size: number = 10): Promise<PageResponse<CriteriaFormResponse>> {
        try {
            const response = await axios.get<ApiResponse<PageResponse<CriteriaFormResponse>>>(
                `${API_BASE_URL}/criteria-forms`,
                { params: { page, size } }
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to get criteria forms with pagination:', error);
            throw new Error(error.response?.data?.message || 'Không thể lấy danh sách biểu mẫu');
        }
    }

    async getCriteriaFormById(id: number): Promise<CriteriaFormResponse> {
        try {
            const response = await axios.get<ApiResponse<CriteriaFormResponse>>(`${API_BASE_URL}/criteria-forms/${id}`);
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to get criteria form:', error);
            throw new Error(error.response?.data?.message || 'Không thể lấy thông tin biểu mẫu');
        }
    }

    async getCriteriaFormByName(name: string): Promise<CriteriaFormResponse> {
        try {
            const response = await axios.get<ApiResponse<CriteriaFormResponse>>(
                `${API_BASE_URL}/criteria-forms/name/${encodeURIComponent(name)}`
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to get criteria form by name:', error);
            throw new Error(error.response?.data?.message || 'Không thể tìm biểu mẫu theo tên');
        }
    }

    async createCriteriaForm(request: CriteriaFormCreateRequest): Promise<CriteriaFormResponse> {
        try {
            const response = await axios.post<ApiResponse<CriteriaFormResponse>>(
                `${API_BASE_URL}/criteria-forms`,
                request
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to create criteria form:', error);
            throw new Error(error.response?.data?.message || 'Không thể tạo biểu mẫu mới');
        }
    }

    async updateCriteriaForm(id: number, request: CriteriaFormCreateRequest): Promise<CriteriaFormResponse> {
        try {
            const response = await axios.put<ApiResponse<CriteriaFormResponse>>(
                `${API_BASE_URL}/criteria-forms/${id}`,
                request
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to update criteria form:', error);
            throw new Error(error.response?.data?.message || 'Không thể cập nhật biểu mẫu');
        }
    }

    async deleteCriteriaForm(id: number): Promise<void> {
        try {
            await axios.delete(`${API_BASE_URL}/criteria-forms/${id}`);
        } catch (error: any) {
            console.error('Failed to delete criteria form:', error);
            throw new Error(error.response?.data?.message || 'Không thể xóa biểu mẫu');
        }
    }

    async searchCriteriaForms(keyword: string): Promise<CriteriaFormResponse[]> {
        try {
            const response = await axios.get<ApiResponse<CriteriaFormResponse[]>>(
                `${API_BASE_URL}/criteria-forms/search`,
                { params: { keyword } }
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to search criteria forms:', error);
            throw new Error(error.response?.data?.message || 'Không thể tìm kiếm biểu mẫu');
        }
    }

    async getCriteriaFormsByEvaluationCycleId(evaluationCycleId: string): Promise<CriteriaFormResponse[]> {
        try {
            const response = await axios.get<ApiResponse<CriteriaFormResponse[]>>(
                `${API_BASE_URL}/criteria-forms/evaluation-cycle/${encodeURIComponent(evaluationCycleId)}`
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Failed to get criteria forms by evaluation cycle:', error);
            throw new Error(error.response?.data?.message || 'Không thể lấy biểu mẫu theo chu kỳ');
        }
    }
}

export const criteriaFormService = new CriteriaFormService();
export default criteriaFormService;