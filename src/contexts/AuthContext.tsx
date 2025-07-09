import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, UserInfo, LoginRequest } from '../services/authService';
import { toast } from 'react-toastify';

// Types
interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        setIsLoading(true);

        // Check if user is already logged in
        console.log('AuthContext: Checking authentication...');
        if (authService.isAuthenticated()) {
          const storedUser = authService.getUser();
          console.log('AuthContext: Found stored user:', storedUser);
          if (storedUser) {
            setUser(storedUser);
          }
        } else {
          console.log('AuthContext: No authentication found');
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Clear invalid auth data
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login function
   */
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      
      const loginResponse = await authService.login(credentials);
      setUser(loginResponse.userInfo);
      
      toast.success(`Chào mừng ${loginResponse.userInfo.employee?.fullName || loginResponse.userInfo.username}!`);
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Đăng nhập thất bại');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Clear user state immediately
      setUser(null);

      // Call logout API
      await authService.logout();

      toast.info('Đã đăng xuất thành công');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API fails, still clear local data
      setUser(null);
      authService.clearAuthData();
      toast.error('Đăng xuất thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async (): Promise<void> => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If refresh fails, logout user
      await logout();
    }
  };

  // Computed values
  const isAuthenticated = !!user && authService.isAuthenticated();

  // Context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for components that require authentication
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }

    return <Component {...props} />;
  };
};

export default AuthContext;
