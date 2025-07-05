import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useEvaluationCriteria } from '../hooks/useEvaluationCriteria';
import { EvaluationCriteriaCreateRequest } from '../services/evaluationCriteriaService';
import { EvaluationQuestionCreateRequest, evaluationQuestionService } from '../services/evaluationQuestionService';
import EvaluationCriteriaFormModal from '../components/EvaluationCriteriaFormModal';
import EvaluationQuestionFormModal from '../components/EvaluationQuestionFormModal';

const ITEMS_PER_PAGE = 10;

const EvaluationCriteriaManagement: React.FC = () => {
  // Use evaluation criteria hook
  const {
    criteria,
    loading,
    error,
    totalCriteria,
    refreshCriteria,
    createCriteria,
    updateCriteria,
    deleteCriteria,
    searchCriteria,
    getCriteriaWithQuestions,
  } = useEvaluationCriteria();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, with-questions, without-questions
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingCriteriaId, setDeletingCriteriaId] = useState<number | null>(null);
  const [expandedCriteria, setExpandedCriteria] = useState<Set<number>>(new Set());
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null);
  
  // Modal states
  const [showAddCriteriaModal, setShowAddCriteriaModal] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Question modal states
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [selectedCriteriaForQuestion, setSelectedCriteriaForQuestion] = useState<any>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  // Filter criteria based on search and filter type
  const filteredCriteria = useMemo(() => {
    let filtered = criteria.filter(item =>
      item.criteriaName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterType === 'with-questions') {
      filtered = filtered.filter(item =>
        item.evaluationQuestions && item.evaluationQuestions.length > 0
      );
    } else if (filterType === 'without-questions') {
      filtered = filtered.filter(item =>
        !item.evaluationQuestions || item.evaluationQuestions.length === 0
      );
    }



    return filtered;
  }, [criteria, searchTerm, filterType]);

  // Pagination
  const totalPages = Math.ceil(filteredCriteria.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCriteria = filteredCriteria.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handlers
  const handleAddCriteria = () => {
    setSelectedCriteria(null);
    setIsEditMode(false);
    setShowAddCriteriaModal(true);
  };

  const handleEditCriteria = (criteriaItem: any) => {
    setSelectedCriteria(criteriaItem);
    setIsEditMode(true);
    setShowAddCriteriaModal(true);
  };

  const handleDeleteCriteria = async (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa tiêu chí đánh giá "${name}"?`)) {
      try {
        setDeletingCriteriaId(id);
        await deleteCriteria(id);
        
        // Reset về trang 1 nếu trang hiện tại không còn dữ liệu
        const newFilteredCount = filteredCriteria.filter(item => item.evaluationCriteriaId !== id).length;
        const newTotalPages = Math.ceil(newFilteredCount / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(1);
        }
      } catch (error: any) {
        toast.error(error.message || 'Không thể xóa tiêu chí đánh giá');
      } finally {
        setDeletingCriteriaId(null);
      }
    }
  };

  const handleSaveCriteria = async (data: EvaluationCriteriaCreateRequest) => {
    try {
      if (isEditMode && selectedCriteria) {
        await updateCriteria(selectedCriteria.evaluationCriteriaId, data);
      } else {
        await createCriteria(data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi lưu tiêu chí đánh giá');
      throw error;
    }
  };

  const handleRefresh = () => {
    refreshCriteria();
  };

  // Expand/Collapse handlers
  const toggleCriteriaExpansion = (criteriaId: number) => {
    setExpandedCriteria(prev => {
      const newSet = new Set(prev);
      if (newSet.has(criteriaId)) {
        newSet.delete(criteriaId);
      } else {
        newSet.add(criteriaId);
      }
      return newSet;
    });
  };

  // Question handlers
  const handleAddQuestionToCriteria = (criteriaItem: any) => {
    setSelectedCriteriaForQuestion(criteriaItem);
    setSelectedQuestion(null);
    setShowAddQuestionModal(true);
  };

  const handleEditQuestion = (question: any, criteriaItem: any) => {
    setSelectedQuestion(question);
    setSelectedCriteriaForQuestion(criteriaItem);
    setShowEditQuestionModal(true);
  };

  const handleDeleteQuestion = async (questionId: number, questionName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa câu hỏi "${questionName}"?`)) {
      try {
        setDeletingQuestionId(questionId);
        await evaluationQuestionService.deleteEvaluationQuestion(questionId);
        toast.success('Xóa câu hỏi thành công!');

        // Refresh criteria to update question counts
        await refreshCriteria();
      } catch (error: any) {
        toast.error(error.message || 'Không thể xóa câu hỏi');
      } finally {
        setDeletingQuestionId(null);
      }
    }
  };

  const handleSaveQuestion = async (data: EvaluationQuestionCreateRequest) => {
    try {
      await evaluationQuestionService.createEvaluationQuestion(data);
      toast.success('Thêm câu hỏi thành công!');

      // Refresh criteria to update question counts
      await refreshCriteria();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi thêm câu hỏi');
      throw error;
    }
  };

  const handleUpdateQuestion = async (data: EvaluationQuestionCreateRequest) => {
    try {
      if (selectedQuestion) {
        await evaluationQuestionService.updateEvaluationQuestion(selectedQuestion.evaluationQuestionId, data);
        toast.success('Cập nhật câu hỏi thành công!');

        // Refresh criteria to update question counts
        await refreshCriteria();
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật câu hỏi');
      throw error;
    }
  };

  const handleFilterChange = async (newFilter: string) => {
    setFilterType(newFilter);
    setCurrentPage(1);
    
    if (newFilter === 'with-questions') {
      await getCriteriaWithQuestions();
    } else {
      await refreshCriteria();
    }
  };

  const getQuestionCountBadge = (questionCount: number) => {
    if (questionCount === 0) {
      return 'bg-red-100 text-red-800';
    } else if (questionCount <= 2) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (questionCount <= 5) {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  // Bỏ status badge và text - chỉ cần số câu hỏi

  // Tính toán thống kê
  const statistics = useMemo(() => {
    const total = filteredCriteria.length;
    const completed = filteredCriteria.filter(c => {
      const count = c.evaluationQuestions?.length || 0;
      return count > 2;
    }).length;
    const needMore = filteredCriteria.filter(c => {
      const count = c.evaluationQuestions?.length || 0;
      return count > 0 && count <= 2;
    }).length;
    const empty = filteredCriteria.filter(c => {
      const count = c.evaluationQuestions?.length || 0;
      return count === 0;
    }).length;

    console.log('Statistics:', { total, completed, needMore, empty });

    return { total, completed, needMore, empty };
  }, [filteredCriteria]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý tiêu chí & câu hỏi đánh giá</h1>
              <p className="text-sm text-gray-600 mt-1">
                Tổng số: <span className="font-medium">{filteredCriteria.length}</span> tiêu chí
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Đang tải...' : 'Làm mới'}
              </button>

              <button
                onClick={handleAddCriteria}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm tiêu chí
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm
              </label>
              <input
                type="text"
                placeholder="Tên tiêu chí..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lọc theo câu hỏi
              </label>
              <select
                value={filterType}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả tiêu chí</option>
                <option value="with-questions">Có câu hỏi</option>
                <option value="without-questions">Chưa có câu hỏi</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setCurrentPage(1);
                  refreshCriteria();
                }}
                className="w-full px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <strong>Lỗi:</strong> {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Đang tải...</span>
          </div>
        )}

        {/* Criteria Cards */}
        {!loading && (
          <div className="space-y-4">
            {paginatedCriteria.map((criteriaItem) => {
              const questionCount = criteriaItem.evaluationQuestions?.length || 0;
              const isExpanded = expandedCriteria.has(criteriaItem.evaluationCriteriaId);

              return (
                <div key={criteriaItem.evaluationCriteriaId} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  {/* Criteria Header */}
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-medium text-gray-900">
                              {criteriaItem.criteriaName}
                            </h3>
                            <span className="text-sm text-gray-500">
                              ID: {criteriaItem.evaluationCriteriaId}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getQuestionCountBadge(questionCount)}`}>
                              {questionCount} câu hỏi
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Action Buttons */}
                        <button
                          onClick={() => handleEditCriteria(criteriaItem)}
                          disabled={deletingCriteriaId === criteriaItem.evaluationCriteriaId}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Sửa
                        </button>

                        <button
                          onClick={() => handleAddQuestionToCriteria(criteriaItem)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Thêm câu hỏi
                        </button>

                        <button
                          onClick={() => toggleCriteriaExpansion(criteriaItem.evaluationCriteriaId)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                          <svg className={`w-4 h-4 mr-1 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          {isExpanded ? 'Thu gọn' : `Xem câu hỏi (${questionCount})`}
                        </button>

                        <button
                          onClick={() => handleDeleteCriteria(criteriaItem.evaluationCriteriaId, criteriaItem.criteriaName)}
                          disabled={deletingCriteriaId === criteriaItem.evaluationCriteriaId}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {deletingCriteriaId === criteriaItem.evaluationCriteriaId ? (
                            <>
                              <svg className="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Đang xóa...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Xóa
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Questions Section */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-medium text-gray-900">
                            Câu hỏi đánh giá ({questionCount})
                          </h4>
                          <button
                            onClick={() => handleAddQuestionToCriteria(criteriaItem)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Thêm câu hỏi
                          </button>
                        </div>

                        {questionCount === 0 ? (
                          <div className="text-center py-8">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có câu hỏi</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Hãy thêm câu hỏi đầu tiên cho tiêu chí này.
                            </p>
                            <div className="mt-4">
                              <button
                                onClick={() => handleAddQuestionToCriteria(criteriaItem)}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Thêm câu hỏi đầu tiên
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {criteriaItem.evaluationQuestions?.map((question, index) => (
                              <div key={question.evaluationQuestionId} className="bg-white border border-gray-200 rounded-md p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        Câu {index + 1}
                                      </span>
                                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getQuestionCountBadge(question.maxScore)}`}>
                                        {question.maxScore} điểm
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-900 leading-relaxed">
                                      {question.questionName}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2 ml-4">
                                    <button
                                      onClick={() => handleEditQuestion(question, criteriaItem)}
                                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Sửa
                                    </button>
                                    <button
                                      onClick={() => handleDeleteQuestion(question.evaluationQuestionId, question.questionName)}
                                      disabled={deletingQuestionId === question.evaluationQuestionId}
                                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                      {deletingQuestionId === question.evaluationQuestionId ? (
                                        <>
                                          <svg className="animate-spin w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                          Đang xóa...
                                        </>
                                      ) : (
                                        <>
                                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                          Xóa
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCriteria.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có tiêu chí đánh giá</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterType !== 'all'
                ? 'Không tìm thấy tiêu chí phù hợp với bộ lọc.'
                : 'Chưa có tiêu chí đánh giá nào trong hệ thống.'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <div className="mt-4">
                <button
                  onClick={handleAddCriteria}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tạo tiêu chí đầu tiên
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredCriteria.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredCriteria.length)} 
                trong tổng số {filteredCriteria.length} tiêu chí
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Trước
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Criteria Modal */}
      <EvaluationCriteriaFormModal
        isOpen={showAddCriteriaModal}
        isEditMode={isEditMode}
        criteria={selectedCriteria}
        onClose={() => {
          setShowAddCriteriaModal(false);
          setSelectedCriteria(null);
          setIsEditMode(false);
        }}
        onSave={handleSaveCriteria}
      />

      {/* Add Question Modal */}
      <EvaluationQuestionFormModal
        isOpen={showAddQuestionModal}
        isEditMode={false}
        question={null}
        criteria={selectedCriteriaForQuestion ? [selectedCriteriaForQuestion] : criteria}
        onClose={() => {
          setShowAddQuestionModal(false);
          setSelectedCriteriaForQuestion(null);
        }}
        onSave={handleSaveQuestion}
      />

      {/* Edit Question Modal */}
      <EvaluationQuestionFormModal
        isOpen={showEditQuestionModal}
        isEditMode={true}
        question={selectedQuestion}
        criteria={selectedCriteriaForQuestion ? [selectedCriteriaForQuestion] : criteria}
        onClose={() => {
          setShowEditQuestionModal(false);
          setSelectedQuestion(null);
          setSelectedCriteriaForQuestion(null);
        }}
        onSave={handleUpdateQuestion}
      />
    </div>
  );
};

export default EvaluationCriteriaManagement;
