import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  evaluationCriteriaService,
  EvaluationCriteriaResponse,
  EvaluationCriteriaCreateRequest
} from '../services/evaluationCriteriaService';
import { evaluationQuestionService } from '../services/evaluationQuestionService';

interface UseEvaluationCriteriaReturn {
  criteria: EvaluationCriteriaResponse[];
  loading: boolean;
  error: string | null;
  totalCriteria: number;
  refreshCriteria: () => Promise<void>;
  createCriteria: (request: EvaluationCriteriaCreateRequest) => Promise<void>;
  updateCriteria: (id: number, request: EvaluationCriteriaCreateRequest) => Promise<void>;
  deleteCriteria: (id: number) => Promise<void>;
  getCriteriaById: (id: number) => Promise<EvaluationCriteriaResponse | null>;
  searchCriteria: (keyword: string) => Promise<void>;
  getCriteriaWithQuestions: () => Promise<void>;
}

export const useEvaluationCriteria = (): UseEvaluationCriteriaReturn => {
  const [criteria, setCriteria] = useState<EvaluationCriteriaResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCriteria, setTotalCriteria] = useState<number>(0);

  // Fetch all criteria with question counts
  const refreshCriteria = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const criteriaList = await evaluationCriteriaService.getAllEvaluationCriteria();

      // Get question counts for each criteria
      const criteriaWithQuestionCounts = await Promise.all(
        criteriaList.map(async (criteriaItem) => {
          try {
            const questions = await evaluationQuestionService.getQuestionsByCriteriaId(criteriaItem.evaluationCriteriaId);
            return {
              ...criteriaItem,
              evaluationQuestions: questions
            };
          } catch (error) {
            console.warn(`Failed to load questions for criteria ${criteriaItem.evaluationCriteriaId}:`, error);
            return {
              ...criteriaItem,
              evaluationQuestions: []
            };
          }
        })
      );

      setCriteria(criteriaWithQuestionCounts);
      setTotalCriteria(criteriaWithQuestionCounts.length);

      console.log('Evaluation criteria loaded successfully:', criteriaWithQuestionCounts.length);
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể tải danh sách tiêu chí đánh giá';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Failed to load evaluation criteria:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new criteria
  const createCriteria = useCallback(async (request: EvaluationCriteriaCreateRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      await evaluationCriteriaService.createEvaluationCriteria(request);
      toast.success('Tạo tiêu chí đánh giá thành công!');
      
      // Refresh the list
      await refreshCriteria();
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể tạo tiêu chí đánh giá';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshCriteria]);

  // Update criteria
  const updateCriteria = useCallback(async (id: number, request: EvaluationCriteriaCreateRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      await evaluationCriteriaService.updateEvaluationCriteria(id, request);
      toast.success('Cập nhật tiêu chí đánh giá thành công!');
      
      // Refresh the list
      await refreshCriteria();
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể cập nhật tiêu chí đánh giá';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshCriteria]);

  // Delete criteria
  const deleteCriteria = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await evaluationCriteriaService.deleteEvaluationCriteria(id);
      toast.success('Xóa tiêu chí đánh giá thành công!');
      
      // Refresh the list
      await refreshCriteria();
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể xóa tiêu chí đánh giá';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshCriteria]);

  // Get criteria by ID
  const getCriteriaById = useCallback(async (id: number): Promise<EvaluationCriteriaResponse | null> => {
    try {
      const criteriaItem = await evaluationCriteriaService.getEvaluationCriteriaById(id);
      return criteriaItem;
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể lấy thông tin tiêu chí đánh giá';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Search criteria
  const searchCriteria = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      await refreshCriteria();
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await evaluationCriteriaService.searchEvaluationCriteria(keyword);
      
      setCriteria(searchResults);
      setTotalCriteria(searchResults.length);
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể tìm kiếm tiêu chí đánh giá';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [refreshCriteria]);

  // Get criteria with questions
  const getCriteriaWithQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const criteriaWithQuestions = await evaluationCriteriaService.getCriteriaWithQuestions();
      
      setCriteria(criteriaWithQuestions);
      setTotalCriteria(criteriaWithQuestions.length);
      
      toast.success(`Tìm thấy ${criteriaWithQuestions.length} tiêu chí có câu hỏi`);
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể lấy tiêu chí đánh giá có câu hỏi';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load criteria on mount
  useEffect(() => {
    refreshCriteria();
  }, [refreshCriteria]);

  return {
    criteria,
    loading,
    error,
    totalCriteria,
    refreshCriteria,
    createCriteria,
    updateCriteria,
    deleteCriteria,
    getCriteriaById,
    searchCriteria,
    getCriteriaWithQuestions,
  };
};
