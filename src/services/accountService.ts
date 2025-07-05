import axios from 'axios';

// Base URL for API
const API_BASE_URL = 'http://localhost:8080/api';

// Types matching backend response
export interface AccountResponse {
  id: number;
  username: string;
  role: string;
  status: string;
}

export interface AccountCreateRequest {
  username: string;
  password: string;
  role: string;
  status?: string;
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

// Account Service Class
class AccountService {
  
  /**
   * Get all accounts without pagination
   */
  async getAllAccounts(): Promise<AccountResponse[]> {
    try {
      const response = await axios.get<ApiResponse<AccountResponse[]>>(
        `${API_BASE_URL}/accounts/all`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get accounts:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy danh sách tài khoản'
      );
    }
  }

  /**
   * Get accounts with pagination
   */
  async getAccountsWithPagination(page: number = 0, size: number = 10): Promise<PageResponse<AccountResponse>> {
    try {
      const response = await axios.get<ApiResponse<PageResponse<AccountResponse>>>(
        `${API_BASE_URL}/accounts`,
        {
          params: { page, size }
        }
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get accounts with pagination:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy danh sách tài khoản'
      );
    }
  }

  /**
   * Get account by ID
   */
  async getAccountById(id: number): Promise<AccountResponse> {
    try {
      const response = await axios.get<ApiResponse<AccountResponse>>(
        `${API_BASE_URL}/accounts/${id}`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get account:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy thông tin tài khoản'
      );
    }
  }

  /**
   * Get account by username
   */
  async getAccountByUsername(username: string): Promise<AccountResponse> {
    try {
      const response = await axios.get<ApiResponse<AccountResponse>>(
        `${API_BASE_URL}/accounts/username/${encodeURIComponent(username)}`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get account by username:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể tìm tài khoản theo username'
      );
    }
  }

  /**
   * Create new account
   */
  async createAccount(request: AccountCreateRequest): Promise<AccountResponse> {
    try {
      const response = await axios.post<ApiResponse<AccountResponse>>(
        `${API_BASE_URL}/accounts`,
        request
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to create account:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể tạo tài khoản mới'
      );
    }
  }

  /**
   * Update account
   */
  async updateAccount(id: number, request: AccountCreateRequest): Promise<AccountResponse> {
    try {
      const response = await axios.put<ApiResponse<AccountResponse>>(
        `${API_BASE_URL}/accounts/${id}`,
        request
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to update account:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể cập nhật tài khoản'
      );
    }
  }

  /**
   * Delete account
   */
  async deleteAccount(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/accounts/${id}`);
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể xóa tài khoản'
      );
    }
  }

  /**
   * Change password
   */
  async changePassword(id: number, newPassword: string): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/accounts/${id}/password`, newPassword, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    } catch (error: any) {
      console.error('Failed to change password:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể thay đổi mật khẩu'
      );
    }
  }

  /**
   * Update account status
   */
  async updateAccountStatus(id: number, status: string): Promise<AccountResponse> {
    try {
      const response = await axios.put<ApiResponse<AccountResponse>>(
        `${API_BASE_URL}/accounts/${id}/status`,
        { status }
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to update account status:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể cập nhật trạng thái tài khoản'
      );
    }
  }

  /**
   * Get accounts by role
   */
  async getAccountsByRole(role: string): Promise<AccountResponse[]> {
    try {
      const response = await axios.get<ApiResponse<AccountResponse[]>>(
        `${API_BASE_URL}/accounts/role/${encodeURIComponent(role)}`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get accounts by role:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy danh sách tài khoản theo vai trò'
      );
    }
  }

  /**
   * Get active accounts
   */
  async getActiveAccounts(): Promise<AccountResponse[]> {
    try {
      const response = await axios.get<ApiResponse<AccountResponse[]>>(
        `${API_BASE_URL}/accounts/active`
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get active accounts:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể lấy danh sách tài khoản hoạt động'
      );
    }
  }

  /**
   * Search accounts by username
   */
  async searchAccounts(keyword: string): Promise<AccountResponse[]> {
    try {
      const response = await axios.get<ApiResponse<AccountResponse[]>>(
        `${API_BASE_URL}/accounts/search`,
        {
          params: { keyword }
        }
      );
      
      return response.data.result;
    } catch (error: any) {
      console.error('Failed to search accounts:', error);
      throw new Error(
        error.response?.data?.message || 'Không thể tìm kiếm tài khoản'
      );
    }
  }

  /**
   * Check if username exists
   */
  async checkUsernameExists(username: string): Promise<boolean> {
    try {
      await this.getAccountByUsername(username);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate next available account ID
   */
  async getNextAvailableId(): Promise<number> {
    try {
      const accounts = await this.getAllAccounts();
      const maxId = Math.max(...accounts.map(acc => acc.id), 0);
      return maxId + 1;
    } catch (error) {
      console.error('Failed to get next available ID:', error);
      return 1;
    }
  }
}

// Export singleton instance
export const accountService = new AccountService();
export default accountService;
