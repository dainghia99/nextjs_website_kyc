'use client';

import { useGetKycStatusQuery } from '../../store/services/kycApi';
import { memo } from 'react';

function KycStatus() {
  // Sử dụng RTK Query hook
  const { data, error, isLoading, refetch } = useGetKycStatusQuery();

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm text-center">
        <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-orange-500 mr-2"></div>
        <span>Đang tải trạng thái KYC...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="bg-red-50 text-red-800 p-3 rounded-lg">
          <p>Lỗi khi tải trạng thái KYC</p>
          <button 
            onClick={() => refetch()} 
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const kycStatus = data?.status || 'pending';

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Trạng thái KYC</h3>
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
        kycStatus === 'verified' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        {kycStatus === 'verified' ? 'Đã xác minh' : 'Chưa xác minh'}
      </div>
      <button 
        onClick={() => refetch()} 
        className="ml-3 text-sm text-orange-500 hover:text-orange-600"
      >
        Cập nhật
      </button>
    </div>
  );
}

// Export memoized component để tối ưu hiệu năng
export default memo(KycStatus); 