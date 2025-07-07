import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { evaluationCycleService, EvaluationCycleResponse, EvaluationCycleCreateRequest } from '../services/evaluationCycleService';

interface UseEvaluationCyclesReturn {
    evaluationCycles: EvaluationCycleResponse[];
    loading: boolean;
    error: string | null;
    totalEvaluationCycles: number;
    refreshEvaluationCycles: () => Promise<void>;
    createEvaluationCycle: (request: EvaluationCycleCreateRequest) => Promise<void>;
    updateEvaluationCycle: (id: number, request: EvaluationCycleCreateRequest) => Promise<void>;
    deleteEvaluationCycle: (id: number) => Promise<void>;
    getEvaluationCycleById: (id: number) => Promise<EvaluationCycleResponse | null>;
    searchEvaluationCycles: (keyword: string) => Promise<void>;
}

export const useEvaluationCycles = (): UseEvaluationCyclesReturn => {
    const [evaluationCycles, setEvaluationCycles] = useState<EvaluationCycleResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [totalEvaluationCycles, setTotalEvaluationCycles] = useState<number>(0);

    const refreshEvaluationCycles = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const cycleList = await evaluationCycleService.getAllEvaluationCycles();
            setEvaluationCycles(cycleList);
            setTotalEvaluationCycles(cycleList.length);
            console.log('Evaluation cycles loaded successfully:', cycleList.length);
        } catch (err: any) {
            const errorMessage = err.message || 'Không thể tải danh sách chu kỳ đánh giá';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Failed to load evaluation cycles:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createEvaluationCycle = useCallback(async (request: EvaluationCycleCreateRequest) => {
        setLoading(true);
        setError(null);

        try {
            await evaluationCycleService.createEvaluationCycle(request);
            toast.success('Tạo chu kỳ đánh giá thành công!');
            await refreshEvaluationCycles();
        } catch (err: any) {
            const errorMessage = err.message || 'Không thể tạo chu kỳ đánh giá';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [refreshEvaluationCycles]);

    const updateEvaluationCycle = useCallback(async (id: number, request: EvaluationCycleCreateRequest) => {
        setLoading(true);
        setError(null);

        try {
            await evaluationCycleService.updateEvaluationCycle(id, request);
            toast.success('Cập nhật chu kỳ đánh giá thành công!');
            await refreshEvaluationCycles();
        } catch (err: any) {
            const errorMessage = err.message || 'Không thể cập nhật chu kỳ đánh giá';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [refreshEvaluationCycles]);

    const deleteEvaluationCycle = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);

        try {
            await evaluationCycleService.deleteEvaluationCycle(id);
            toast.success('Xóa chu kỳ đánh giá thành công!');
            await refreshEvaluationCycles();
        } catch (err: any) {
            const errorMessage = err.message || 'Không thể xóa chu kỳ đánh giá';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [refreshEvaluationCycles]);

    const getEvaluationCycleById = useCallback(async (id: number): Promise<EvaluationCycleResponse | null> => {
        try {
            const cycle = await evaluationCycleService.getEvaluationCycleById(id);
            return cycle;
        } catch (err: any) {
            const errorMessage = err.message || 'Không thể lấy thông tin chu kỳ đánh giá';
            setError(errorMessage);
            toast.error(errorMessage);
            return null;
        }
    }, []);

    const searchEvaluationCycles = useCallback(async (keyword: string) => {
        if (!keyword.trim()) {
            await refreshEvaluationCycles();
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const searchResults = await evaluationCycleService.searchEvaluationCycles(keyword);
            setEvaluationCycles(searchResults);
            setTotalEvaluationCycles(searchResults.length);
        } catch (err: any) {
            const errorMessage = err.message || 'Không thể tìm kiếm chu kỳ đánh giá';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [refreshEvaluationCycles]);

    useEffect(() => {
        refreshEvaluationCycles();
    }, [refreshEvaluationCycles]);

    return {
        evaluationCycles,
        loading,
        error,
        totalEvaluationCycles,
        refreshEvaluationCycles,
        createEvaluationCycle,
        updateEvaluationCycle,
        deleteEvaluationCycle,
        getEvaluationCycleById,
        searchEvaluationCycles,
    };
};