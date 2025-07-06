import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { criteriaFormService, CriteriaFormResponse, CriteriaFormCreateRequest } from '../services/criteriaFormService';

interface UseCriteriaFormReturn {
    forms: CriteriaFormResponse[];
    loading: boolean;
    error: string | null;
    totalForms: number;
    refreshForms: () => Promise<void>;
    createForm: (request: CriteriaFormCreateRequest) => Promise<void>;
    updateForm: (id: number, request: CriteriaFormCreateRequest) => Promise<void>;
    deleteForm: (id: number) => Promise<void>;
    searchForms: (keyword: string) => Promise<void>;
}

export const useCriteriaForm = (): UseCriteriaFormReturn => {
    const [forms, setForms] = useState<CriteriaFormResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [totalForms, setTotalForms] = useState<number>(0);

    const refreshForms = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const formList = await criteriaFormService.getAllCriteriaForms();
            setForms(formList);
            setTotalForms(formList.length);
            console.log('Criteria forms loaded successfully:', formList.length);
        } catch (err: any) {
            const errorMessage = err.message || 'Không thể tải danh sách biểu mẫu';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Failed to load criteria forms:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createForm = useCallback(async (request: CriteriaFormCreateRequest) => {
        setLoading(true);
        setError(null);

        try {
            await criteriaFormService.createCriteriaForm(request);
            toast.success('Tạo biểu mẫu thành công!');
            await refreshForms();
        } catch (err: any) {
            const errorMessage = err.message || 'Không thể tạo biểu mẫu';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [refreshForms]);

    const updateForm = useCallback(async (id: number, request: CriteriaFormCreateRequest) => {
        setLoading(true);
        setError(null);

        try {
            await criteriaFormService.updateCriteriaForm(id, request);
            toast.success('Cập nhật biểu mẫu thành công!');
            await refreshForms();
        } catch (err: any) {
            const errorMessage = err.message || 'Không thể cập nhật biểu mẫu';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [refreshForms]);

    const deleteForm = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);

        try {
            await criteriaFormService.deleteCriteriaForm(id);
            toast.success('Xóa biểu mẫu thành công!');
            await refreshForms();
        } catch (err: any) {
            const errorMessage = err.message || 'Không thể xóa biểu mẫu';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [refreshForms]);

    const searchForms = useCallback(async (keyword: string) => {
        if (!keyword.trim()) {
            await refreshForms();
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const searchResults = await criteriaFormService.searchCriteriaForms(keyword);
            setForms(searchResults);
            setTotalForms(searchResults.length);
        } catch (err: any) {
            const errorMessage = err.message || 'Không thể tìm kiếm biểu mẫu';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [refreshForms]);

    useEffect(() => {
        refreshForms();
    }, [refreshForms]);

    return {
        forms,
        loading,
        error,
        totalForms,
        refreshForms,
        createForm,
        updateForm,
        deleteForm,
        searchForms,
    };
};