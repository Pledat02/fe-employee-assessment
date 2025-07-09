import React, { useState, useEffect } from 'react';
import { EvaluationHistoryItem, calculateSentiment } from '../types/evaluationHistory';
import { EvaluationHistoryService } from '../services/evaluationHistoryService';

const EvaluationHistory: React.FC = () => {
  const [historyData, setHistoryData] = useState<EvaluationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<EvaluationHistoryItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    sentiment: '',
    status: '',
    employeeName: ''
  });

  useEffect(() => {
    loadHistoryData();
  }, [filters]);

  const loadHistoryData = async () => {
    try {
      setLoading(true);
      const data = await EvaluationHistoryService.getEvaluationHistory(filters);
      setHistoryData(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const detail = await EvaluationHistoryService.getEvaluationDetail(id);
      setSelectedItem(detail);
      setShowDetail(true);
    } catch (error) {
      console.error('Error loading detail:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      COMPLETED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
      IN_PROGRESS: { label: 'Đang thực hiện', color: 'bg-yellow-100 text-yellow-800' },
      PENDING: { label: 'Chờ xử lý', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Lịch sử đánh giá</h1>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm theo tên nhân viên
            </label>
            <input
              type="text"
              value={filters.employeeName}
              onChange={(e) => setFilters({...filters, employeeName: e.target.value})}
              placeholder="Nhập tên nhân viên..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhãn đánh giá
            </label>
            <select
              value={filters.sentiment}
              onChange={(e) => setFilters({...filters, sentiment: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="EXCELLENT">Xuất sắc</option>
              <option value="GOOD">Tốt</option>
              <option value="AVERAGE">Trung bình</option>
              <option value="POOR">Tệ</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="IN_PROGRESS">Đang thực hiện</option>
              <option value="PENDING">Chờ xử lý</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Danh sách đánh giá ({historyData.length} kết quả)
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {historyData.map((item) => (
            <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.employeeName}
                    </h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${item.sentimentColor}`}>
                      {item.sentimentLabel}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Phòng ban:</span> {item.departmentName}
                    </div>
                    <div>
                      <span className="font-medium">Form:</span> {item.formName}
                    </div>
                    <div>
                      <span className="font-medium">Điểm TB:</span> 
                      <span className="ml-1 font-semibold text-blue-600">
                        {item.averageScore.toFixed(1)}/5.0
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Hoàn thành:</span> 
                      {item.completedQuestions}/{item.totalQuestions}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Ngày tạo:</span> {formatDate(item.createdAt)}
                    {item.updatedAt !== item.createdAt && (
                      <span className="ml-4">
                        <span className="font-medium">Cập nhật:</span> {formatDate(item.updatedAt)}
                      </span>
                    )}
                  </div>
                  
                  {item.comment && (
                    <div className="mt-2 text-sm text-gray-700 italic">
                      "{item.comment}"
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  <button
                    onClick={() => handleViewDetail(item.id)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {historyData.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có dữ liệu</h3>
            <p className="mt-1 text-sm text-gray-500">Không tìm thấy lịch sử đánh giá nào.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Chi tiết đánh giá - {selectedItem.employeeName}
              </h2>
              <button
                onClick={() => setShowDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedItem.averageScore.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Điểm trung bình</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${selectedItem.sentimentColor.split(' ')[0]}`}>
                    {selectedItem.sentimentLabel}
                  </div>
                  <div className="text-sm text-gray-600">Nhãn đánh giá</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedItem.completedQuestions}</div>
                  <div className="text-sm text-gray-600">Câu hỏi hoàn thành</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{selectedItem.totalQuestions}</div>
                  <div className="text-sm text-gray-600">Tổng câu hỏi</div>
                </div>
              </div>

              {/* Assessment Items */}
              {selectedItem.assessmentItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Chi tiết điểm số</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Câu hỏi
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tự đánh giá
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giám sát
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quản lý
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tổng điểm
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedItem.assessmentItems.map((item, index) => (
                          <tr key={item.questionId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Câu hỏi {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.employeeScore}/5
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.supervisorScore}/5
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.managerScore}/5
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              {item.totalScore}/15
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Comment */}
              {selectedItem.comment && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nhận xét</h3>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-700 italic">"{selectedItem.comment}"</p>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Chu kì:</span> {selectedItem.cycleName}
                </div>
                <div>
                  <span className="font-medium">Form đánh giá:</span> {selectedItem.formName}
                </div>
                <div>
                  <span className="font-medium">Ngày tạo:</span> {formatDate(selectedItem.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Cập nhật lần cuối:</span> {formatDate(selectedItem.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationHistory;
