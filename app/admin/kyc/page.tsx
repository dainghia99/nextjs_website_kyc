"use client";

import { useState, useEffect } from "react";
import { getVerifiedAccounts } from "@/services/kyc";
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function KYCManagement() {
  const [loading, setLoading] = useState(true);
  const [kycRequests, setKycRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchKYCRequests = async () => {
      setLoading(true);
      try {
        // Lấy danh sách tài khoản đã xác minh
        const accountsData = await getVerifiedAccounts();
        const verifiedAccounts = accountsData.accounts || [];
        
        // Thêm một số yêu cầu KYC mẫu đang chờ xử lý
        const mockPendingRequests = [
          {
            id: 201,
            user_id: 101,
            email: "pending1@example.com",
            full_name: "Đỗ Thị D",
            submitted_at: "2024-05-16T08:30:00",
            status: "pending",
            id_card_front: "/uploads/id_cards/front_101.jpg",
            id_card_back: "/uploads/id_cards/back_101.jpg",
            selfie_path: "/uploads/selfies/101.jpg",
          },
          {
            id: 202,
            user_id: 102,
            email: "pending2@example.com",
            full_name: "Phạm Văn E",
            submitted_at: "2024-05-16T09:45:00",
            status: "pending",
            id_card_front: "/uploads/id_cards/front_102.jpg",
            id_card_back: "/uploads/id_cards/back_102.jpg",
            selfie_path: "/uploads/selfies/102.jpg",
          },
          {
            id: 203,
            user_id: 103,
            email: "pending3@example.com",
            full_name: "Hoàng Thị F",
            submitted_at: "2024-05-15T14:20:00",
            status: "pending",
            id_card_front: "/uploads/id_cards/front_103.jpg",
            id_card_back: "/uploads/id_cards/back_103.jpg",
            selfie_path: "/uploads/selfies/103.jpg",
          },
          {
            id: 204,
            user_id: 104,
            email: "rejected1@example.com",
            full_name: "Vũ Văn G",
            submitted_at: "2024-05-14T11:10:00",
            status: "rejected",
            id_card_front: "/uploads/id_cards/front_104.jpg",
            id_card_back: "/uploads/id_cards/back_104.jpg",
            selfie_path: "/uploads/selfies/104.jpg",
            rejection_reason: "Ảnh CCCD không rõ nét",
          },
          {
            id: 205,
            user_id: 105,
            email: "rejected2@example.com",
            full_name: "Ngô Thị H",
            submitted_at: "2024-05-13T16:05:00",
            status: "rejected",
            id_card_front: "/uploads/id_cards/front_105.jpg",
            id_card_back: "/uploads/id_cards/back_105.jpg",
            selfie_path: "/uploads/selfies/105.jpg",
            rejection_reason: "Khuôn mặt không khớp với ảnh trên CCCD",
          }
        ];
        
        // Chuyển đổi tài khoản đã xác minh thành định dạng yêu cầu KYC
        const verifiedRequests = verifiedAccounts.map(account => ({
          id: 100 + account.id,
          user_id: account.id,
          email: account.email,
          full_name: account.full_name,
          submitted_at: new Date(new Date(account.verified_at).getTime() - 24*60*60*1000).toISOString(), // Giả sử gửi yêu cầu 1 ngày trước khi được xác minh
          verified_at: account.verified_at,
          status: "verified",
          id_card_front: `/uploads/id_cards/front_${account.id}.jpg`,
          id_card_back: `/uploads/id_cards/back_${account.id}.jpg`,
          selfie_path: `/uploads/selfies/${account.id}.jpg`,
        }));
        
        setKycRequests([...verifiedRequests, ...mockPendingRequests]);
      } catch (error) {
        console.error("Error fetching KYC requests:", error);
        
        // Sử dụng dữ liệu mẫu nếu API chưa được triển khai
        setKycRequests([
          {
            id: 101,
            user_id: 1,
            email: "user1@example.com",
            full_name: "Nguyễn Văn A",
            submitted_at: "2024-05-14T10:30:00",
            verified_at: "2024-05-15T10:30:00",
            status: "verified",
            id_card_front: "/uploads/id_cards/front_1.jpg",
            id_card_back: "/uploads/id_cards/back_1.jpg",
            selfie_path: "/uploads/selfies/1.jpg",
          },
          {
            id: 102,
            user_id: 2,
            email: "user2@example.com",
            full_name: "Trần Thị B",
            submitted_at: "2024-05-13T14:45:00",
            verified_at: "2024-05-14T14:45:00",
            status: "verified",
            id_card_front: "/uploads/id_cards/front_2.jpg",
            id_card_back: "/uploads/id_cards/back_2.jpg",
            selfie_path: "/uploads/selfies/2.jpg",
          },
          {
            id: 201,
            user_id: 101,
            email: "pending1@example.com",
            full_name: "Đỗ Thị D",
            submitted_at: "2024-05-16T08:30:00",
            status: "pending",
            id_card_front: "/uploads/id_cards/front_101.jpg",
            id_card_back: "/uploads/id_cards/back_101.jpg",
            selfie_path: "/uploads/selfies/101.jpg",
          },
          {
            id: 204,
            user_id: 104,
            email: "rejected1@example.com",
            full_name: "Vũ Văn G",
            submitted_at: "2024-05-14T11:10:00",
            status: "rejected",
            id_card_front: "/uploads/id_cards/front_104.jpg",
            id_card_back: "/uploads/id_cards/back_104.jpg",
            selfie_path: "/uploads/selfies/104.jpg",
            rejection_reason: "Ảnh CCCD không rõ nét",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchKYCRequests();
  }, []);

  // Lọc yêu cầu KYC theo từ khóa tìm kiếm và trạng thái
  const filteredRequests = kycRequests.filter(
    (request) => {
      const matchesSearch = 
        request.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filterStatus === "all" || 
        request.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    }
  );

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Hàm định dạng ngày giờ
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Xử lý phê duyệt yêu cầu KYC (giả lập)
  const handleApproveKYC = (requestId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn phê duyệt yêu cầu KYC này?")) {
      // Trong thực tế, bạn sẽ gọi API để phê duyệt yêu cầu
      setKycRequests(kycRequests.map(request => 
        request.id === requestId 
          ? { 
              ...request, 
              status: "verified", 
              verified_at: new Date().toISOString() 
            } 
          : request
      ));
    }
  };

  // Xử lý từ chối yêu cầu KYC (giả lập)
  const handleRejectKYC = (requestId: number) => {
    const reason = prompt("Vui lòng nhập lý do từ chối:");
    if (reason) {
      // Trong thực tế, bạn sẽ gọi API để từ chối yêu cầu
      setKycRequests(kycRequests.map(request => 
        request.id === requestId 
          ? { 
              ...request, 
              status: "rejected", 
              rejection_reason: reason 
            } 
          : request
      ));
    }
  };

  // Xử lý xem chi tiết yêu cầu KYC (giả lập)
  const handleViewKYC = (requestId: number) => {
    // Trong thực tế, bạn sẽ chuyển hướng đến trang chi tiết hoặc mở modal
    alert(`Xem chi tiết yêu cầu KYC có ID: ${requestId}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Quản lý KYC</h1>
      
      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="Tìm kiếm yêu cầu KYC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-4">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Đang chờ</option>
            <option value="verified">Đã xác minh</option>
            <option value="rejected">Đã từ chối</option>
          </select>
        </div>
      </div>

      {/* Bảng yêu cầu KYC */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Người dùng
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ngày gửi
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Trạng thái
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ghi chú
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          Không tìm thấy yêu cầu KYC nào
                        </td>
                      </tr>
                    ) : (
                      currentRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {request.full_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {request.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(request.submitted_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              request.status === "verified" 
                                ? "bg-green-100 text-green-800" 
                                : request.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {request.status === "verified" 
                                ? "Đã xác minh" 
                                : request.status === "rejected"
                                ? "Đã từ chối"
                                : "Đang chờ"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.rejection_reason || 
                             (request.verified_at && `Xác minh lúc: ${formatDateTime(request.verified_at)}`) ||
                             ""}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleViewKYC(request.id)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            {request.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApproveKYC(request.id)}
                                  className="text-green-600 hover:text-green-900 mr-4"
                                >
                                  <CheckCircleIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleRejectKYC(request.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <XCircleIcon className="h-5 w-5" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phân trang */}
      {!loading && totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{indexOfFirstItem + 1}</span> đến{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredRequests.length)}
              </span>{" "}
              trong tổng số <span className="font-medium">{filteredRequests.length}</span> yêu cầu
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Trang trước</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    page === currentPage
                      ? "z-10 bg-orange-50 border-orange-500 text-orange-600"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Trang sau</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
