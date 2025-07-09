import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { evaluationService, AssessmentRequest, AssessmentItem } from '../services/assessmentService';
import { evaluationQuestionService } from '../services/evaluationQuestionService';
import SentimentLabel from '../components/SentimentLabel';

type SentimentType = 'Tốt' | 'Tung bình' | 'Cưa tốt';

interface CriterionItem {
  questionId: number;
  text: string;
  maxScore: number;
  employeeScore: number;
  supervisorScore: number;
  managerScore: number;
}

interface Criterion {
  criteriaId: number;
  name: string;
  items: CriterionItem[];
}

interface Assessor {
  id: number;
  fullName: string;
  role: 'EMPLOYEE' | 'SUPERVISOR' | 'MANAGER';
  departmentName: string;
}

interface EmployeeResponse {
  code: number;
  fullName: string;
  department: { departmentName: string };
  division?: string;
}

interface EvaluationCycleResponse {
  evaluationCycleId: number;
  startDate: string;
  endDate: string;
  department?: { departmentName: string };
}

interface CriteriaFormResponse {
  criteriaFormId: number;
  criteriaFormName: string;
  evaluationCriteria: Array<{ evaluationCriteriaId: number; criteriaName: string }>;
}

const EvaluationForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    selectedCycle,
    selectedForm,
    selectedEmployee,
    assessor,
    employees,
    cycles,
    forms,
  } = location.state || {};

  const [sentiment, setSentiment] = useState<SentimentType | null>(null);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [comments, setComments] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(true);

  // Check permission when employee is selected
  useEffect(() => {
    if (selectedEmployee && assessor) {
      const selectedEmployeeData = employees.find((emp: EmployeeResponse) => emp.code === selectedEmployee);
      if (selectedEmployeeData) {
        const isSameDepartment = selectedEmployeeData.department.departmentName === assessor.departmentName;
        const isSelfEvaluation = selectedEmployeeData.code === assessor.id && assessor.role === 'EMPLOYEE';
        setHasPermission(isSelfEvaluation || (['SUPERVISOR', 'MANAGER'].includes(assessor.role) && isSameDepartment));
      } else {
        setHasPermission(false);
      }
    } else {
      setHasPermission(true);
    }
  }, [selectedEmployee, assessor, employees]);

  // Fetch criteria/questions and existing assessment
  useEffect(() => {
    if (selectedForm && selectedEmployee && hasPermission) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const form = forms.find((f: CriteriaFormResponse) => f.criteriaFormId === selectedForm);
          if (!form || !form.evaluationCriteria) {
            throw new Error('Không tìm thấy biểu mẫu hoặc tiêu chí');
          }

          const criteriaList: Criterion[] = await Promise.all(
              form.evaluationCriteria.map(async criterion => {
                try {
                  const questions = await evaluationQuestionService.getQuestionsByCriteriaId(
                      criterion.evaluationCriteriaId
                  );
                  return {
                    criteriaId: criterion.evaluationCriteriaId,
                    name: criterion.criteriaName,
                    items: questions.map(question => ({
                      questionId: question.evaluationQuestionId,
                      text: question.questionName,
                      maxScore: question.maxScore,
                      employeeScore: 0,
                      supervisorScore: 0,
                      managerScore: 0,
                    })),
                  };
                } catch (err: any) {
                  console.error(`Failed to fetch questions for criterion ${criterion.evaluationCriteriaId}:`, err);
                  return {
                    criteriaId: criterion.evaluationCriteriaId,
                    name: criterion.criteriaName,
                    items: [],
                  };
                }
              })
          );

          setCriteria(criteriaList);

          try {
            const assessment = await evaluationService.getAssessmentByFormAndEmployeeId(
                selectedForm,
                selectedEmployee
            );
            if (assessment.sentiment) {
              setSentiment(assessment.sentiment as SentimentType);
            }
            setCriteria(prev => {
              const updated = [...prev];
              assessment.assessmentItems.forEach((item: AssessmentItem) => {
                updated.forEach(criterion => {
                  const targetItem = criterion.items.find(i => i.questionId === item.questionId);
                  if (targetItem) {
                    targetItem.employeeScore = item.employeeScore || 0;
                    targetItem.supervisorScore = item.supervisorScore || 0;
                    targetItem.managerScore = item.managerScore || 0;
                  }
                });
              });
              return updated;
            });
            setComments(assessment.comment || '');
          } catch (err: any) {
            if (err.message.includes('Không thể lấy thông tin đánh giá')) {
              console.log('No existing assessment found, starting fresh with scores set to 0.');
            } else {
              // setError(err.message);
            }
          }
        } catch (err: any) {
          setError(err.message || 'Không thể tải dữ liệu tiêu chí hoặc câu hỏi');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedForm, selectedEmployee, forms, hasPermission]);

  // Handle score change based on role
  const handleScoreChange = (criteriaId: number, questionId: number, value: number, role: 'EMPLOYEE' | 'SUPERVISOR' | 'MANAGER') => {
    setCriteria(prev => {
      const updated = [...prev];
      const criterion = updated.find(c => c.criteriaId === criteriaId);
      if (criterion) {
        const item = criterion.items.find(i => i.questionId === questionId);
        if (item) {
          const score = Math.max(0, Math.min(value, item.maxScore));
          if (role === 'EMPLOYEE') item.employeeScore = score;
          else if (role === 'SUPERVISOR') item.supervisorScore = score;
          else if (role === 'MANAGER') item.managerScore = score;
        }
      }
      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedForm || !selectedEmployee || !assessor || !hasPermission) return;
    setIsLoading(true);
    setError(null);
    try {
      const assessmentItems: AssessmentItem[] = criteria.flatMap(criterion =>
          criterion.items.map(item => ({
            questionId: item.questionId,
            employeeScore: item.employeeScore,
            supervisorScore: item.supervisorScore,
            managerScore: item.managerScore,
          }))
      );
      const request: AssessmentRequest = {
        assessmentItems,
        assessorId: assessor.id,
        comment: comments || undefined,
        employeeId: selectedEmployee,
        formId: selectedForm,
      };
      await evaluationService.submitAssessment(request);
      toast.success('Đánh giá đã được lưu thành công!');
    } catch (err: any) {
      setError(err.message || 'Không thể lưu đánh giá');
      toast.error(err.message || 'Không thể lưu đánh giá');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedEmployeeData = employees.find((emp: EmployeeResponse) => emp.code === selectedEmployee);
  const selectedCycleData = cycles.find((cycle: EvaluationCycleResponse) => cycle.evaluationCycleId === selectedCycle);
  const selectedFormData = forms.find((form: CriteriaFormResponse) => form.criteriaFormId === selectedForm);

  return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 border-b border-gray-200 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 flex items-center md:mb-0">
              <img
                  className="size-10 rounded-full"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedEmployeeData?.fullName || '')}&background=random`}
                  alt={selectedEmployeeData?.fullName}
              />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">{selectedEmployeeData?.fullName}</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{selectedEmployeeData?.division}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedEmployeeData?.department.departmentName}</span>
                </div>
                {sentiment && (
                    <div className="mt-2">
                      <SentimentLabel sentiment={sentiment} />
                    </div>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0">
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-500">Chu kỳ:</span>
                <span className="text-sm font-medium text-gray-900">
                {selectedCycleData?.startDate} - {selectedCycleData?.endDate}
              </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-500">Biểu mẫu:</span>
                <span className="text-sm font-medium text-gray-900">{selectedFormData?.criteriaFormName}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-500">Người đánh giá:</span>
                <span className="text-sm font-medium text-gray-900">{assessor?.fullName}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {isLoading && (
              <div className="flex items-center justify-center py-4">
                <svg className="size-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="ml-2 text-sm text-gray-600">Đang tải...</span>
              </div>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!hasPermission && (
              <p className="text-sm text-red-500">
                Bạn không có quyền đánh giá nhân viên này. Vui lòng chọn nhân viên trong cùng phòng ban hoặc đảm bảo bạn
                có vai trò phù hợp.
              </p>
          )}
          {criteria.length === 0 && !isLoading && !error && hasPermission && (
              <p className="text-sm text-gray-500">Không có tiêu chí hoặc câu hỏi nào.</p>
          )}
          {criteria.length > 0 && hasPermission && (
              <div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">Tiêu chí đánh giá</h3>
                {criteria.map((criterion, cIndex) => (
                    <div key={criterion.criteriaId} className="mb-6">
                      <div className="mb-2 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900">
                        {criterion.name} (ID: {criterion.criteriaId})
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                          <tr>
                            <th className="w-1/2 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Nội dung câu hỏi
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                              Điểm tối đa
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                              Nhân viên
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                              Giám sát
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                              Quản lý
                            </th>
                          </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                          {criterion.items.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                  Không có câu hỏi nào cho tiêu chí này
                                </td>
                              </tr>
                          ) : (
                              criterion.items.map((item, iIndex) => (
                                  <tr key={item.questionId}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.text}</td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">{item.maxScore}</td>
                                    <td className="px-6 py-4 text-center">
                                      <input
                                          type="number"
                                          min="0"
                                          max={item.maxScore}
                                          value={item.employeeScore}
                                          onChange={e =>
                                              handleScoreChange(criterion.criteriaId, item.questionId, Number(e.target.value), 'EMPLOYEE')
                                          }
                                          className="w-20 rounded-md border border-gray-300 px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          disabled={isLoading || assessor.role !== 'EMPLOYEE'}
                                      />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <input
                                          type="number"
                                          min="0"
                                          max={item.maxScore}
                                          value={item.supervisorScore}
                                          onChange={e =>
                                              handleScoreChange(criterion.criteriaId, item.questionId, Number(e.target.value), 'SUPERVISOR')
                                          }
                                          className="w-20 rounded-md border border-gray-300 px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          disabled={isLoading || assessor.role !== 'SUPERVISOR' || !hasPermission}
                                      />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <input
                                          type="number"
                                          min="0"
                                          max={item.maxScore}
                                          value={item.managerScore}
                                          onChange={e =>
                                              handleScoreChange(criterion.criteriaId, item.questionId, Number(e.target.value), 'MANAGER')
                                          }
                                          className="w-20 rounded-md border border-gray-300 px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          disabled={isLoading || assessor.role !== 'MANAGER' || !hasPermission}
                                      />
                                    </td>
                                  </tr>
                              ))
                          )}
                          <tr className="bg-gray-100 font-semibold text-gray-900">
                            <td className="px-6 py-4 text-right">Tổng điểm:</td>
                            <td className="px-6 py-4 text-center">
                              {criterion.items.reduce((sum, item) => sum + item.maxScore, 0)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {criterion.items.reduce((sum, item) => sum + item.employeeScore, 0)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {criterion.items.reduce((sum, item) => sum + item.supervisorScore, 0)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {criterion.items.reduce((sum, item) => sum + item.managerScore, 0)}
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                ))}
              </div>
          )}

          {hasPermission && (
              <div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">Nhận xét chung</h3>
                <textarea
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Nhập nhận xét chung ở đây..."
                    disabled={isLoading}
                />
              </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
                onClick={() => navigate('/evaluation-selection')}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={isLoading}
            >
              Quay lại
            </button>
            <button
                onClick={handleSubmit}
                disabled={isLoading || !hasPermission}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading && (
                  <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
              )}
              {isLoading ? 'Đang lưu...' : 'Lưu đánh giá'}
            </button>
          </div>
        </div>
      </div>
  );
};

export default EvaluationForm;