import axios from 'axios';

// Base URL for API
const API_BASE_URL = 'http://localhost:8080/api';

// Types matching backend response
export interface QuestionInfo {
  evaluationQuestionId: number;
  questionText: string;
  questionType: string;
  maxScore: number;
}

export interface EvaluationCriteriaResponse {
  evaluationCriteriaId: number;
  criteriaName: string;
  evaluationQuestions?: QuestionInfo[];
}

export interface EvaluationCriteriaCreateRequest {
  criteriaName: string;
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

// Evaluation Criteria Service Class
class EvaluationCriteriaService {
  
  /**
   * Get all evaluation criteria without pagination
   */
  async getAllEvaluationCriteria(): Promise<EvaluationCriteriaResponse[]> {
    try {
      const response = await axios.get<ApiResponse<EvaluationCriteriaResponse[]>>(
        `${API_BASE_URL}/evaluation-criteria/all`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get evaluation criteria:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy danh sách tiêu chí đánh giá'
      );
    }
  }

  /**
   * Get evaluation criteria with pagination
   */
  async getEvaluationCriteriaWithPagination(page: number = 0, size: number = 10): Promise<PageResponse<EvaluationCriteriaResponse>> {
    try {
      const response = await axios.get<ApiResponse<PageResponse<EvaluationCriteriaResponse>>>(
        `${API_BASE_URL}/evaluation-criteria`,
        {
          params: { page, size }
        }
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get evaluation criteria with pagination:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy danh sách tiêu chí đánh giá'
      );
    }
  }

  /**
   * Get evaluation criteria by ID
   */
  async getEvaluationCriteriaById(id: number): Promise<EvaluationCriteriaResponse> {
    try {
      const response = await axios.get<ApiResponse<EvaluationCriteriaResponse>>(
        `${API_BASE_URL}/evaluation-criteria/${id}`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get evaluation criteria:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy thông tin tiêu chí đánh giá'
      );
    }
  }

  /**
   * Get evaluation criteria by name
   */
  async getEvaluationCriteriaByName(name: string): Promise<EvaluationCriteriaResponse> {
    try {
      const response = await axios.get<ApiResponse<EvaluationCriteriaResponse>>(
        `${API_BASE_URL}/evaluation-criteria/name/${encodeURIComponent(name)}`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get evaluation criteria by name:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể tìm tiêu chí đánh giá theo tên'
      );
    }
  }

  /**
   * Create new evaluation criteria
   */
  async createEvaluationCriteria(request: EvaluationCriteriaCreateRequest): Promise<EvaluationCriteriaResponse> {
    try {
      const response = await axios.post<ApiResponse<EvaluationCriteriaResponse>>(
        `${API_BASE_URL}/evaluation-criteria`,
        request
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to create evaluation criteria:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể tạo tiêu chí đánh giá mới'
      );
    }
  }

  /**
   * Update evaluation criteria
   */
  async updateEvaluationCriteria(id: number, request: EvaluationCriteriaCreateRequest): Promise<EvaluationCriteriaResponse> {
    try {
      const response = await axios.put<ApiResponse<EvaluationCriteriaResponse>>(
        `${API_BASE_URL}/evaluation-criteria/${id}`,
        request
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to update evaluation criteria:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể cập nhật tiêu chí đánh giá'
      );
    }
  }

  /**
   * Delete evaluation criteria
   */
  async deleteEvaluationCriteria(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/evaluation-criteria/${id}`);
    } catch (error: any) {
      console.error('Failed to delete evaluation criteria:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể xóa tiêu chí đánh giá'
      );
    }
  }

  /**
   * Get criteria with questions
   */
  async getCriteriaWithQuestions(): Promise<EvaluationCriteriaResponse[]> {
    try {
      const response = await axios.get<ApiResponse<EvaluationCriteriaResponse[]>>(
        `${API_BASE_URL}/evaluation-criteria/with-questions`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get criteria with questions:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy tiêu chí đánh giá có câu hỏi'
      );
    }
  }

  /**
   * Search evaluation criteria by name
   */
  async searchEvaluationCriteria(keyword: string): Promise<EvaluationCriteriaResponse[]> {
    try {
      const response = await axios.get<ApiResponse<EvaluationCriteriaResponse[]>>(
        `${API_BASE_URL}/evaluation-criteria/search`,
        {
          params: { keyword }
        }
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to search evaluation criteria:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể tìm kiếm tiêu chí đánh giá'
      );
    }
  }

  /**
   * Check if criteria name exists
   */
  async checkCriteriaNameExists(name: string): Promise<boolean> {
    try {
      await this.getEvaluationCriteriaByName(name);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get criteria statistics
   */
  async getCriteriaStatistics(): Promise<{
    totalCriteria: number;
    criteriaWithQuestions: number;
    criteriaWithoutQuestions: number;
  }> {
    try {
      const allCriteria = await this.getAllEvaluationCriteria();
      const criteriaWithQuestions = await this.getCriteriaWithQuestions();
      
      return {
        totalCriteria: allCriteria.length,
        criteriaWithQuestions: criteriaWithQuestions.length,
        criteriaWithoutQuestions: allCriteria.length - criteriaWithQuestions.length,
      };
    } catch (error: any) {
      console.error('Failed to get criteria statistics:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy thống kê tiêu chí đánh giá'
      );
    }
  }
}

// Export singleton instance
export const evaluationCriteriaService = new EvaluationCriteriaService();
export default evaluationCriteriaService;
