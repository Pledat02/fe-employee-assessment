import { useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Role constants
export const ROLES = {
  EMPLOYEE: 'EMPLOYEE',
  SUPERVISOR: 'SUPERVISOR', 
  MANAGER: 'MANAGER'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Menu permissions based on role
export interface MenuPermissions {
  employees: boolean;        // Quản lý nhân viên
  departments: boolean;      // Quản lý phòng ban
  cycles: boolean;          // Quản lý chu kì
  evaluationForm: boolean;  // Quản lý form
  criteria: boolean;        // Tiêu chí & Câu hỏi
  evaluation: boolean;      // Đánh giá nhân viên
  statistics: boolean;      // Thống kê đánh giá
  evaluationHistory: boolean; // Lịch sử đánh giá
}

/**
 * Hook để kiểm tra quyền truy cập dựa trên role
 */
export const useRoleAccess = () => {
  const { user } = useAuth();

  const userRole = user?.role as Role;

  // Tính toán quyền truy cập menu dựa trên role
  const menuPermissions: MenuPermissions = useMemo(() => {
    if (!userRole) {
      return {
        employees: false,
        departments: false,
        cycles: false,
        evaluationForm: false,
        criteria: false,
        evaluation: false,
        statistics: false,
        evaluationHistory: false,
      };
    }

    switch (userRole) {
      case ROLES.EMPLOYEE:
        return {
          employees: false,
          departments: false,
          cycles: false,
          evaluationForm: false,
          criteria: false,
          evaluation: true,      // ✅ Chỉ được đánh giá
          statistics: false,
          evaluationHistory: true, // ✅ Xem lịch sử đánh giá
        };

      case ROLES.SUPERVISOR:
        return {
          employees: false,      // ❌ Không được quản lý nhân viên
          departments: false,    // ❌ Không được quản lý phòng ban
          cycles: true,          // ✅ Quản lý chu kì
          evaluationForm: true,  // ✅ Quản lý form
          criteria: true,        // ✅ Tiêu chí & câu hỏi
          evaluation: true,      // ✅ Đánh giá nhân viên
          statistics: true,      // ✅ Thống kê
          evaluationHistory: true, // ✅ Lịch sử đánh giá
        };

      case ROLES.MANAGER:
        return {
          employees: true,       // ✅ Quản lý nhân viên
          departments: true,     // ✅ Quản lý phòng ban
          cycles: true,          // ✅ Quản lý chu kì
          evaluationForm: true,  // ✅ Quản lý form
          criteria: true,        // ✅ Tiêu chí & câu hỏi
          evaluation: true,      // ✅ Đánh giá nhân viên
          statistics: true,      // ✅ Thống kê
          evaluationHistory: true, // ✅ Lịch sử đánh giá
        };

      default:
        return {
          employees: false,
          departments: false,
          cycles: false,
          evaluationForm: false,
          criteria: false,
          evaluation: false,
          statistics: false,
          evaluationHistory: false,
        };
    }
  }, [userRole]);

  // Helper functions
  const hasRole = (role: Role): boolean => {
    return userRole === role;
  };

  const hasAnyRole = (roles: Role[]): boolean => {
    if (!userRole) return false;
    return roles.includes(userRole);
  };

  const getDefaultRoute = (): string => {
    switch (userRole) {
      case ROLES.EMPLOYEE:
        return '/evaluation';  // Nhân viên -> trang đánh giá
      case ROLES.SUPERVISOR:
        return '/cycles';      // Giám sát -> trang quản lý chu kì
      case ROLES.MANAGER:
        return '/';            // Quản lý -> trang quản lý nhân viên
      default:
        return '/evaluation';
    }
  };

  return {
    userRole,
    menuPermissions,
    hasRole,
    hasAnyRole,
    getDefaultRoute,
  };
};
