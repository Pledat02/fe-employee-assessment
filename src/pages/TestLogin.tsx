import React, { useState } from 'react';
import { authService } from '../services/authService';

const TestLogin: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTestLogin = async () => {
    setIsLoading(true);
    setResult('Đang test...');
    
    try {
      const response = await authService.login({ username, password });
      setResult(`✅ Đăng nhập thành công!\n${JSON.stringify(response, null, 2)}`);
    } catch (error: any) {
      setResult(`❌ Lỗi: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAPI = async () => {
    setIsLoading(true);
    setResult('Đang test API...');
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ API hoạt động!\n${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`❌ API lỗi: ${data.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      setResult(`❌ Không thể kết nối API: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🧪 Test Đăng Nhập</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Thông tin đăng nhập</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleTestAPI}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Test API trực tiếp
            </button>
            
            <button
              onClick={handleTestLogin}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Test qua AuthService
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Kết quả:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {result || 'Chưa có kết quả...'}
          </pre>
        </div>
        
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            📝 Hướng dẫn:
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>1. Đảm bảo backend đang chạy tại localhost:8080</li>
            <li>2. Click "Test API trực tiếp" để kiểm tra kết nối</li>
            <li>3. Click "Test qua AuthService" để test service</li>
            <li>4. Kiểm tra console browser để xem log chi tiết</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestLogin;
