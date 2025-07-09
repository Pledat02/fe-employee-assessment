import { EvaluationHistoryItem, CriteriaChartData, CycleStatistics } from '../types/evaluationHistory';
import axios from 'axios';

// Base URL for API
const API_BASE_URL = 'http://localhost:8080/api';

// API Response interface
interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// Page Response interface
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Interface cho chu kỳ đánh giá
export interface EvaluationCycle {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
}

// Interface cho filter
export interface EvaluationHistoryFilter {
  sentiment?: string;
  status?: string;
  employeeName?: string;
  cycleId?: number;
  cycleName?: string;
  employeeId?: number; // Thêm filter theo employeeId cho role EMPLOYEE
}

// Service để lấy dữ liệu từ API
export class EvaluationHistoryService {
  // Helper method để lấy token
  private static getAuthToken(): string {
    const token = localStorage.getItem('token') || '';
    console.log('🔑 Auth Token:', token ? `${token.substring(0, 20)}...` : 'No token found');
    return token;
  }

  // Helper method để tạo headers
  private static getAuthHeaders() {
    const token = this.getAuthToken();
    const headers = {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    };
    console.log('📋 Request Headers:', {
      ...headers,
      'Authorization': headers.Authorization ? `Bearer ${token.substring(0, 20)}...` : 'No auth'
    });
    return headers;
  }

  // Helper method để check nếu API available
  private static async isApiAvailable(): Promise<boolean> {
    try {
      console.log('🔍 Testing API availability...');
      const response = await axios.get(`${API_BASE_URL}/evaluation-history/cycles`, {
        headers: this.getAuthHeaders(),
        timeout: 5000
      });
      console.log('✅ API is available:', response.status);
      return response.status === 200;
    } catch (error: any) {
      console.log('❌ API not available:', error.message);
      console.log('Error details:', error.response?.status, error.response?.data);
      return false;
    }
  }

  // Public method để test API
  static async testApiConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log('🧪 Testing API connection...');
      const url = `${API_BASE_URL}/evaluation-history/cycles`;
      const headers = this.getAuthHeaders();

      console.log('Test URL:', url);
      console.log('Test Headers:', headers);

      const response = await axios.get(url, {
        headers,
        timeout: 10000
      });

      return {
        success: true,
        message: `API connection successful (${response.status})`,
        details: {
          status: response.status,
          data: response.data
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: `API connection failed: ${error.message}`,
        details: {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        }
      };
    }
  }

  static async getEvaluationHistory(filters?: EvaluationHistoryFilter): Promise<EvaluationHistoryItem[]> {
    try {
      const params = new URLSearchParams();

      if (filters?.sentiment) params.append('sentiment', filters.sentiment);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.employeeName) params.append('employeeName', filters.employeeName);
      if (filters?.cycleName) params.append('cycleName', filters.cycleName);
      if (filters?.employeeId) params.append('employeeId', filters.employeeId.toString());
      if (filters?.cycleId) params.append('cycleId', filters.cycleId.toString());

      // Pagination params
      params.append('page', '0');
      params.append('size', '100'); // Lấy nhiều để hiển thị tất cả
      params.append('sort', 'createdAt');
      params.append('direction', 'desc');

      const url = `${API_BASE_URL}/evaluation-history?${params.toString()}`;
      const headers = this.getAuthHeaders();

      console.log('🚀 API Call Details:');
      console.log('URL:', url);
      console.log('Headers:', headers);
      console.log('Filters:', filters);

      const response = await axios.get<ApiResponse<PageResponse<EvaluationHistoryItem>>>(
        url,
        {
          headers,
          timeout: 10000 // 10 second timeout
        }
      );

      console.log('✅ API Response Success:', response.status);
      console.log('Response Data:', response.data);

      if (response.data && response.data.result && response.data.result.content) {
        console.log(`📊 Found ${response.data.result.content.length} evaluation history items`);
        return response.data.result.content;
      } else {
        console.warn('⚠️ API response format unexpected:', response.data);
        return [];
      }
    } catch (error: any) {
      console.error('❌ API Error Details:');
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);

      // Throw error instead of fallback to mock data
      throw new Error(`API call failed: ${error.message}`);
    }
  }


  
  static async getEvaluationDetail(id: number): Promise<EvaluationHistoryItem | null> {
    try {
      console.log('🚀 Getting evaluation detail for ID:', id);
      const response = await axios.get<ApiResponse<EvaluationHistoryItem>>(
        `${API_BASE_URL}/evaluation-history/${id}`,
        { headers: this.getAuthHeaders() }
      );
      console.log('✅ Evaluation detail response:', response.data);
      return response.data.result;
    } catch (error: any) {
      console.error('❌ Error fetching evaluation detail:', error.message);
      throw new Error(`Failed to fetch evaluation detail: ${error.message}`);
    }
  }

  // Lấy danh sách chu kỳ duy nhất từ lịch sử đánh giá
  static async getUniqueCycles(): Promise<string[]> {
    try {
      const url = `${API_BASE_URL}/evaluation-history/cycles`;
      const headers = this.getAuthHeaders();
      const response = await axios.get<ApiResponse<string[]>>(
        url,
        {
          headers,
          timeout: 10000
        }
      );

      console.log('✅ Cycles API Response:', response.status);
      console.log('Cycles Data:', response.data);

      if (response.data && response.data.result) {
        console.log(`Found ${response.data.result.length} cycles`);
        return response.data.result;
      } else {
        console.warn('Cycles API response format unexpected');
        return [];
      }
    } catch (error: any) {
      console.error('❌ Error fetching cycles:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error(`Failed to fetch cycles: ${error.message}`);
    }
  }

  // Tạo dữ liệu biểu đồ cho chu kỳ
  static async getCycleChartData(cycleName: string): Promise<CriteriaChartData[]> {
    try {
      console.log('Fetching chart data for cycle:', cycleName);
      const response = await axios.get<ApiResponse<CriteriaChartData[]>>(
        `${API_BASE_URL}/evaluation-history/criteria-chart/${encodeURIComponent(cycleName)}`,
        { headers: this.getAuthHeaders() }
      );
      console.log('Chart data API response:', response.data);

      // Convert API response format to frontend format if needed
      const apiData = response.data.result;
      return apiData.map(item => ({
        criteriaName: item.criteriaName,
        averageScore: item.averageScore,
        employeeScore: item.employeeScore,
        supervisorScore: item.supervisorScore,
        managerScore: item.managerScore,
        color: item.color
      }));
    } catch (error: any) {
      console.error('Error fetching cycle chart data:', error.message);
      throw new Error(`Failed to fetch chart data: ${error.message}`);
    }
  }


  // Lấy thống kê chu kỳ
  static async getCycleStatistics(cycleName: string): Promise<CycleStatistics> {
    try {
      console.log('Fetching statistics for cycle:', cycleName);
      const response = await axios.get<ApiResponse<CycleStatistics>>(
        `${API_BASE_URL}/evaluation-history/statistics/${encodeURIComponent(cycleName)}`,
        { headers: this.getAuthHeaders() }
      );
      console.log('Statistics API response:', response.data);
      return response.data.result;
    } catch (error: any) {
      console.error('Error fetching cycle statistics:', error.message);
      throw new Error(`Failed to fetch statistics: ${error.message}`);
    }
  }
}
