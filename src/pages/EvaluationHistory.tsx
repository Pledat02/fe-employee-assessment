import React, { useState, useEffect } from 'react';
import { EvaluationHistoryItem, CriteriaChartData, CycleStatistics } from '../types/evaluationHistory';
import { EvaluationHistoryService, EvaluationHistoryFilter } from '../services/evaluationHistoryService';
import CriteriaChart from '../components/CriteriaChart';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../hooks/useRoleAccess';

const EvaluationHistory: React.FC = () => {
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState<EvaluationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);


  // Chu kỳ và biểu đồ
  const [availableCycles, setAvailableCycles] = useState<string[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<string>('');
  const [chartData, setChartData] = useState<CriteriaChartData[]>([]);
  const [cycleStats, setCycleStats] = useState<CycleStatistics | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check user role and permissions
  const isEmployee = user?.role === ROLES.EMPLOYEE;
  const canViewAllEvaluations = user?.role === ROLES.MANAGER || user?.role === ROLES.SUPERVISOR;
  const currentEmployeeId = user?.employee?.code;

  // Filters
  const [filters, setFilters] = useState<EvaluationHistoryFilter>({
    sentiment: '',
    status: '',
    employeeName: '',
    cycleName: ''
  });

  // Effect để set employeeId filter cho EMPLOYEE role
  useEffect(() => {
    if (isEmployee && currentEmployeeId) {
      setFilters(prev => ({ ...prev, employeeId: currentEmployeeId }));
    }
  }, [isEmployee, currentEmployeeId]);

  // Load danh sách chu kỳ khi component mount và user đã đăng nhập
  useEffect(() => {
    if (user && currentEmployeeId) {
      loadAvailableCycles();
    }
  }, [user, currentEmployeeId]);

  // Load dữ liệu lịch sử khi filters thay đổi
  useEffect(() => {
    loadHistoryData();
  }, [filters]);

  // Load dữ liệu biểu đồ khi chu kỳ được chọn
  useEffect(() => {
    if (selectedCycle) {
      loadChartData(selectedCycle);
    }
  }, [selectedCycle]);

  const loadAvailableCycles = async () => {
    // Kiểm tra authentication trước khi gọi API
    if (!user) {
      setError('Vui lòng đăng nhập để xem lịch sử đánh giá');
      return;
    }

    try {
      setError(null);
      console.log('🔄 Loading available cycles...');
      console.log('Current user:', user);
      console.log('Auth token exists:', !!localStorage.getItem('token'));

      const cycles = await EvaluationHistoryService.getUniqueCycles();
      console.log('✅ Loaded cycles:', cycles);
      setAvailableCycles(cycles);
      // Tự động chọn chu kỳ đầu tiên nếu có
      if (cycles.length > 0 && !selectedCycle) {
        setSelectedCycle(cycles[0]);
        setFilters(prev => ({ ...prev, cycleName: cycles[0] }));
      }
    } catch (error: any) {
      setAvailableCycles([]);
    }
  };

  const loadHistoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading history data with filters:', filters);
      const data = await EvaluationHistoryService.getEvaluationHistory(filters);
      console.log('Loaded history data:', data);
      setHistoryData(data);
    } catch (error) {
      console.error('Error loading history:', error);
      setError('Không thể tải dữ liệu lịch sử đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async (cycleName: string) => {
    try {
      setChartLoading(true);
      setError(null);
      console.log('Loading chart data for cycle:', cycleName);
      const [chartData, stats] = await Promise.all([
        EvaluationHistoryService.getCycleChartData(cycleName),
        EvaluationHistoryService.getCycleStatistics(cycleName)
      ]);
      console.log('Loaded chart data:', chartData);
      console.log('Loaded stats:', stats);
      setChartData(chartData);
      setCycleStats(stats);
    } catch (error) {
      console.error('Error loading chart data:', error);
      setError('Không thể tải dữ liệu biểu đồ');
    } finally {
      setChartLoading(false);
    }
  };

  const handleCycleChange = (cycleName: string) => {
    setSelectedCycle(cycleName);
    setFilters(prev => ({ ...prev, cycleName }));
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



  // Hiển thị loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Kiểm tra authentication
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa đăng nhập</h3>
          <p className="mt-1 text-sm text-gray-500">Vui lòng đăng nhập để xem lịch sử đánh giá.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={async () => {
                  try {
                    const result = await EvaluationHistoryService.testApiConnection();
                    alert(`API Test: ${result.success ? 'SUCCESS' : 'FAILED'}\n${result.message}`);
                  } catch (error) {
                    alert(`API Test Error: ${error}`);
                  }
                }}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Test API
              </button>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEmployee ? `Lịch sử đánh giá của bạn` : 'Lịch sử đánh giá theo chu kỳ'}
          </h1>
          <div className="flex items-center space-x-4">
            {isEmployee && user?.employee && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Nhân viên:</span> {user.employee.fullName} ({user.employee.code})
              </div>
            )}
          </div>
        </div>

        {/* Cycle Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn chu kỳ đánh giá
          </label>
          <select
            value={selectedCycle}
            onChange={(e) => handleCycleChange(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">-- Chọn chu kỳ --</option>
            {availableCycles.map((cycle) => (
              <option key={cycle} value={cycle}>
                {cycle}
              </option>
            ))}
          </select>
        </div>

        {/* Cycle Statistics */}
        {cycleStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
            {canViewAllEvaluations ? (
              // Thống kê cho MANAGER và SUPERVISOR
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{cycleStats.totalEvaluations}</div>
                  <div className="text-sm text-gray-600">Tổng đánh giá</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{cycleStats.completedEvaluations}</div>
                  <div className="text-sm text-gray-600">Đã hoàn thành</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {cycleStats.averageScore}/5.0
                  </div>
                  <div className="text-sm text-gray-600">Điểm TB tổng thể</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((cycleStats.completedEvaluations / cycleStats.totalEvaluations) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Tỷ lệ hoàn thành</div>
                </div>
              </>
            ) : (
              // Thống kê cho EMPLOYEE (chỉ hiển thị thông tin cá nhân)
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{historyData.length}</div>
                  <div className="text-sm text-gray-600">Đánh giá của bạn</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {historyData.filter(item => item.status === 'COMPLETED').length}
                  </div>
                  <div className="text-sm text-gray-600">Đã hoàn thành</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {historyData.length > 0 ?
                      (historyData.reduce((sum, item) => sum + (item.averageScore || 0), 0) / historyData.length).toFixed(1) :
                      '0.0'
                    }/5.0
                  </div>
                  <div className="text-sm text-gray-600">Điểm TB của bạn</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {historyData.length > 0 ?
                      Math.round((historyData.filter(item => item.status === 'COMPLETED').length / historyData.length) * 100) :
                      0
                    }%
                  </div>
                  <div className="text-sm text-gray-600">Tỷ lệ hoàn thành</div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Filters */}
        <div className={`grid grid-cols-1 ${canViewAllEvaluations ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 mb-6`}>
          {/* Chỉ hiển thị filter tên nhân viên cho MANAGER và SUPERVISOR */}
          {canViewAllEvaluations && (
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
          )}
          
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

      {/* Chart Section */}
      {selectedCycle && (
        <div className="space-y-6">
          {chartLoading ? (
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            </div>
          ) : (
            <CriteriaChart
              data={chartData}
              title={isEmployee ?
                `Biểu đồ điểm của bạn - ${selectedCycle}` :
                `Biểu đồ điểm theo tiêu chí - ${selectedCycle}`
              }
              height={400}
              showLegend={true}
              showDetailedBars={false}
            />
          )}
        </div>
      )}

      {/* History List */}
      {selectedCycle && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {isEmployee ?
                `Lịch sử đánh giá của bạn - ${selectedCycle} (${historyData.length} kết quả)` :
                `Danh sách đánh giá - ${selectedCycle} (${historyData.length} kết quả)`
              }
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
                    {item.sentimentLabel && (
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${item.sentimentColor || 'bg-gray-100 text-gray-800'}`}>
                        {item.sentimentLabel}
                      </span>
                    )}
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
                        {item.averageScore?.toFixed(1) || '0.0'}/5.0
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
                

              </div>
            </div>
          ))}
        </div>
        
          {historyData.length === 0 && selectedCycle && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có dữ liệu</h3>
              <p className="mt-1 text-sm text-gray-500">Không tìm thấy lịch sử đánh giá nào cho chu kỳ này.</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State - No Cycle Selected */}
      {!selectedCycle && availableCycles.length > 0 && (
        <div className="bg-white rounded-lg border p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0v-4a4 4 0 018 0v4z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Chọn chu kỳ đánh giá</h3>
          <p className="mt-2 text-gray-500">Vui lòng chọn một chu kỳ đánh giá để xem lịch sử và biểu đồ.</p>
        </div>
      )}



    </div>
  );
};

export default EvaluationHistory;
