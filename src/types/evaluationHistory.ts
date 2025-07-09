// Interface dựa trên SummaryAssessmentResponse với thêm các trường cho lịch sử
export interface EvaluationHistoryItem {
  // Từ SummaryAssessmentResponse
  assessmentItems: AssessmentItem[];
  assessorId: number;
  comment?: string;
  employeeId: number;
  formId: number;
  
  // Thêm các trường cho lịch sử
  id: number;
  employeeName: string;
  departmentName: string;
  formName: string;
  cycleName: string;
  createdAt: string;
  updatedAt: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  
  // Thống kê điểm số
  averageScore: number;
  totalQuestions: number;
  completedQuestions: number;
  
  // Sentiment analysis - nhãn đánh giá
  sentiment: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
  sentimentLabel: string; // " Xuất sắc\, \Tốt\, \Trung bình\, \Tệ\
 sentimentColor: string; // Màu hiển thị
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
