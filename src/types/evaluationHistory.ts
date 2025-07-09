// Interface dựa trên API response
export interface EvaluationHistoryItem {
  id: number;
  employeeId: number;
  employeeName: string;
  departmentName: string;
  formId: number;
  formName: string;
  cycleName: string;
  createdAt: string;
  updatedAt: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  comment?: string;

  // Thống kê điểm số
  averageScore: number;
  totalQuestions: number;
  completedQuestions: number;

  // Sentiment analysis - nhãn đánh giá
  sentiment: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
  sentimentLabel: string;
  sentimentColor: string;

  // Chi tiết đánh giá
  assessmentItems: AssessmentItem[];
}

export interface AssessmentItem {
  questionId: number;
  questionText?: string;
  criteriaName?: string;
  employeeScore: number;
  supervisorScore: number;
  managerScore: number;
  totalScore?: number;
}

// Interface cho dữ liệu biểu đồ cột
export interface CriteriaChartData {
  criteriaName: string;
  averageScore: number;
  employeeScore: number;
  supervisorScore: number;
  managerScore: number;
  color?: string;
}

// Interface cho thống kê chu kỳ
export interface CycleStatistics {
  cycleName: string;
  totalEvaluations: number;
  completedEvaluations: number;
  averageScore: number;
  criteriaData: CriteriaChartData[];
}

// Helper function để tính sentiment
export const calculateSentiment = (averageScore: number) => {
 if (averageScore >= 4.5) {
 return {
 sentiment: 'EXCELLENT' as const,
 sentimentLabel: 'Xuất sắc',
 sentimentColor: 'text-green-600 bg-green-100'
 };
 } else if (averageScore >= 3.5) {
 return {
 sentiment: 'GOOD' as const, 
 sentimentLabel: 'Tốt',
 sentimentColor: 'text-blue-600 bg-blue-100'
 };
 } else if (averageScore >= 2.5) {
 return {
 sentiment: 'AVERAGE' as const,
 sentimentLabel: 'Trung bình', 
 sentimentColor: 'text-yellow-600 bg-yellow-100'
 };
 } else {
 return {
 sentiment: 'POOR' as const,
 sentimentLabel: 'Tệ',
 sentimentColor: 'text-red-600 bg-red-100'
 };
 }
};
