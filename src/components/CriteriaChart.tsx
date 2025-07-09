import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CriteriaChartData } from '../types/evaluationHistory';

interface CriteriaChartProps {
  data: CriteriaChartData[];
  title?: string;
  height?: number;
  showLegend?: boolean;
  showDetailedBars?: boolean;
}

const CriteriaChart: React.FC<CriteriaChartProps> = ({
  data,
  title = 'Biểu đồ điểm theo tiêu chí',
  height = 400,
  showLegend = true,
  showDetailedBars = false
}) => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{entry.value}/5.0</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Format label cho trục X
  const formatXAxisLabel = (value: string) => {
    if (value.length > 15) {
      return value.substring(0, 15) + '...';
    }
    return value;
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có dữ liệu</h3>
            <p className="mt-1 text-sm text-gray-500">Chưa có dữ liệu đánh giá cho chu kỳ này.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="criteriaName"
              tickFormatter={formatXAxisLabel}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 5]}
              tick={{ fontSize: 12 }}
              label={{ value: 'Điểm số', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            
            {showDetailedBars ? (
              // Hiển thị 3 cột riêng biệt cho từng loại đánh giá
              <>
                <Bar 
                  dataKey="employeeScore" 
                  name="Tự đánh giá"
                  fill="#3b82f6" 
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="supervisorScore" 
                  name="Giám sát viên"
                  fill="#10b981" 
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="managerScore" 
                  name="Quản lý"
                  fill="#f59e0b" 
                  radius={[2, 2, 0, 0]}
                />
              </>
            ) : (
              // Hiển thị 1 cột điểm trung bình
              <Bar 
                dataKey="averageScore" 
                name="Điểm trung bình"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Thống kê tóm tắt */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {data.length}
          </div>
          <div className="text-sm text-gray-600">Tiêu chí</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            {(data.reduce((sum, item) => sum + item.averageScore, 0) / data.length).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Điểm TB</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-yellow-600">
            {Math.max(...data.map(item => item.averageScore)).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Cao nhất</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-red-600">
            {Math.min(...data.map(item => item.averageScore)).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Thấp nhất</div>
        </div>
      </div>
    </div>
  );
};

export default CriteriaChart;
