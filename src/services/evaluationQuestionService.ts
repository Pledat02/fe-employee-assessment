import axios from 'axios';

// Base URL for API
const API_BASE_URL = 'http://localhost:8080/api';

// Types matching backend response
export interface EvaluationQuestionResponse {
  evaluationQuestionId: number;
  questionName: string;
  maxScore: number;
}

export interface EvaluationQuestionCreateRequest {
  questionName: string;
  maxScore: number;
  evaluationCriteriaId: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// Simplified Evaluation Question Service for Criteria Integration
class EvaluationQuestionService {
  
  /**
   * Get questions by criteria ID
   */
  async getQuestionsByCriteriaId(criteriaId: number): Promise<EvaluationQuestionResponse[]> {
    try {
      const response = await axios.get<ApiResponse<EvaluationQuestionResponse[]>>(
        `${API_BASE_URL}/evaluation-questions/criteria/${criteriaId}`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get questions by criteria:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy câu hỏi theo tiêu chí'
      );
    }
  }

  /**
   * Create new evaluation question
   */
  async createEvaluationQuestion(request: EvaluationQuestionCreateRequest): Promise<EvaluationQuestionResponse> {
    try {
      const response = await axios.post<ApiResponse<EvaluationQuestionResponse>>(
        `${API_BASE_URL}/evaluation-questions`,
        request
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to create evaluation question:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể tạo câu hỏi đánh giá mới'
      );
    }
  }

  /**
   * Update evaluation question
   */
  async updateEvaluationQuestion(id: number, request: EvaluationQuestionCreateRequest): Promise<EvaluationQuestionResponse> {
    try {
      const response = await axios.put<ApiResponse<EvaluationQuestionResponse>>(
        `${API_BASE_URL}/evaluation-questions/${id}`,
        request
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to update evaluation question:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể cập nhật câu hỏi đánh giá'
      );
    }
  }

  /**
   * Delete evaluation question
   */
  async deleteEvaluationQuestion(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/evaluation-questions/${id}`);
    } catch (error: any) {
      console.error('Failed to delete evaluation question:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể xóa câu hỏi đánh giá'
      );
    }
  }
}

// Export singleton instance
export const evaluationQuestionService = new EvaluationQuestionService();
export default evaluationQuestionService;
