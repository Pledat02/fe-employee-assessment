import axios from 'axios';

// Base URL for API
const API_BASE_URL = 'http://localhost:8080/api';

// Types matching backend request/response
export interface AssessmentItem {
    questionId: number;
    employeeScore: number;
    supervisorScore: number;
    managerScore: number;
}

export interface AssessmentRequest {
    assessmentItems: AssessmentItem[];
    assessorId: number;
    comment?: string;
    employeeId: number;
    formId: number;
}

export interface SummaryAssessmentResponse {
    assessmentId?: number;
    assessmentItems: AssessmentItem[];
    assessorId: number;
    comment?: string;
    employeeId: number;
    sentiment: string
    formId: number;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}
class EvaluationService {
  /**
   * Submit a new assessment
   */
  async submitAssessment(request: AssessmentRequest): Promise<SummaryAssessmentResponse> {
    try {
      const response = await axios.post<ApiResponse<SummaryAssessmentResponse>>(
        `${API_BASE_URL}/evaluations`,
        request
      );
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to submit assessment:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể gửi đánh giá'
      );
    }
  }

  /**
   * Get assessment by form ID and employee ID
   */
  async getAssessmentByFormAndEmployeeId(formId: number, employeeId: number): Promise<SummaryAssessmentResponse> {
    try {
      const response = await axios.get<ApiResponse<SummaryAssessmentResponse>>(
        `${API_BASE_URL}/evaluations/${formId}/${employeeId}`
        );
            return response.data.result;
        } catch (error: any) {
            console.error(`Failed to get assessment for formId: ${formId}, employeeId: ${employeeId}`, error);
            throw new Error(
                error.response?.data?.message || 'Không thể lấy thông tin đánh giá'
            );
        }
    }
}

// Export singleton instance
export const evaluationService = new EvaluationService();
export default evaluationService;