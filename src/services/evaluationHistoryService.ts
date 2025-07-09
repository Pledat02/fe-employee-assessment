import { EvaluationHistoryItem, calculateSentiment } from '../types/evaluationHistory';

// Mock data cho lịch sử đánh giá
export const mockEvaluationHistory: EvaluationHistoryItem[] = [
  {
    id: 1,
    assessmentItems: [
      { questionId: 1, employeeScore: 4, supervisorScore: 4, managerScore: 5, totalScore: 13 },
      { questionId: 2, employeeScore: 5, supervisorScore: 4, managerScore: 4, totalScore: 13 },
      { questionId: 3, employeeScore: 3, supervisorScore: 4, managerScore: 4, totalScore: 11 },
    ],
    assessorId: 1,
    comment: 'Nhân viên có tiến bộ rõ rệt trong quý này',
    employeeId: 101,
    formId: 1,
    employeeName: 'Nguyễn Văn An',
    departmentName: 'Phòng IT',
    formName: 'Form đánh giá Q4 2024',
    cycleName: 'Chu kì đánh giá cuối năm 2024',
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-15T14:20:00Z',
    status: 'COMPLETED',
    averageScore: 4.1,
    totalQuestions: 3,
    completedQuestions: 3,
    ...calculateSentiment(4.1)
  },
  {
    id: 2,
    assessmentItems: [
      { questionId: 1, employeeScore: 5, supervisorScore: 5, managerScore: 5, totalScore: 15 },
      { questionId: 2, employeeScore: 4, supervisorScore: 5, managerScore: 5, totalScore: 14 },
      { questionId: 3, employeeScore: 5, supervisorScore: 4, managerScore: 5, totalScore: 14 },
    ],
    assessorId: 2,
    comment: 'Xuất sắc! Nhân viên đạt mọi mục tiêu đề ra',
    employeeId: 102,
    formId: 1,
    employeeName: 'Trần Thị Bình',
    departmentName: 'Phòng Marketing',
    formName: 'Form đánh giá Q4 2024',
    cycleName: 'Chu kì đánh giá cuối năm 2024',
    createdAt: '2024-12-14T09:15:00Z',
    updatedAt: '2024-12-14T16:45:00Z',
    status: 'COMPLETED',
    averageScore: 4.8,
    totalQuestions: 3,
    completedQuestions: 3,
    ...calculateSentiment(4.8)
  },
  {
    id: 3,
    assessmentItems: [
      { questionId: 1, employeeScore: 3, supervisorScore: 3, managerScore: 3, totalScore: 9 },
      { questionId: 2, employeeScore: 2, supervisorScore: 3, managerScore: 2, totalScore: 7 },
    ],
    assessorId: 1,
    comment: 'Cần cải thiện kỹ năng giao tiếp và làm việc nhóm',
    employeeId: 103,
    formId: 2,
    employeeName: 'Lê Văn Cường',
    departmentName: 'Phòng Kế toán',
    formName: 'Form đánh giá Q3 2024',
    cycleName: 'Chu kì đánh giá giữa năm 2024',
    createdAt: '2024-09-20T11:00:00Z',
    updatedAt: '2024-09-22T10:30:00Z',
    status: 'IN_PROGRESS',
    averageScore: 2.7,
    totalQuestions: 3,
    completedQuestions: 2,
    ...calculateSentiment(2.7)
  },
  {
    id: 4,
    assessmentItems: [
      { questionId: 1, employeeScore: 1, supervisorScore: 2, managerScore: 2, totalScore: 5 },
      { questionId: 2, employeeScore: 2, supervisorScore: 2, managerScore: 1, totalScore: 5 },
      { questionId: 3, employeeScore: 2, supervisorScore: 1, managerScore: 2, totalScore: 5 },
    ],
    assessorId: 3,
    comment: 'Hiệu suất làm việc chưa đạt yêu cầu, cần có kế hoạch cải thiện',
    employeeId: 104,
    formId: 2,
    employeeName: 'Phạm Thị Dung',
    departmentName: 'Phòng Nhân sự',
    formName: 'Form đánh giá Q3 2024',
    cycleName: 'Chu kì đánh giá giữa năm 2024',
    createdAt: '2024-09-18T14:20:00Z',
    updatedAt: '2024-09-25T09:15:00Z',
    status: 'COMPLETED',
    averageScore: 1.7,
    totalQuestions: 3,
    completedQuestions: 3,
    ...calculateSentiment(1.7)
  },
  {
    id: 5,
    assessmentItems: [],
    assessorId: 1,
    comment: '',
    employeeId: 105,
    formId: 3,
    employeeName: 'Hoàng Văn Em',
    departmentName: 'Phòng IT',
    formName: 'Form đánh giá Q1 2025',
    cycleName: 'Chu kì đánh giá đầu năm 2025',
    createdAt: '2025-01-05T08:00:00Z',
    updatedAt: '2025-01-05T08:00:00Z',
    status: 'PENDING',
    averageScore: 0,
    totalQuestions: 5,
    completedQuestions: 0,
    ...calculateSentiment(0)
  }
];

// Mock service để lấy dữ liệu
export class EvaluationHistoryService {
  static async getEvaluationHistory(filters?: any): Promise<EvaluationHistoryItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredData = [...mockEvaluationHistory];
    
    // Apply filters
    if (filters?.sentiment) {
      filteredData = filteredData.filter(item => item.sentiment === filters.sentiment);
    }
    
    if (filters?.status) {
      filteredData = filteredData.filter(item => item.status === filters.status);
    }
    
    if (filters?.employeeName) {
      filteredData = filteredData.filter(item => 
        item.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase())
      );
    }
    
    // Sort by date (newest first)
    filteredData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return filteredData;
  }
  
  static async getEvaluationDetail(id: number): Promise<EvaluationHistoryItem | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockEvaluationHistory.find(item => item.id === id) || null;
  }
}
