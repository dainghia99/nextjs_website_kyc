"use client";

import { useState, useEffect } from "react";
import { getVerifiedAccounts } from "@/services/kyc";
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function UsersManagement() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Lấy danh sách tài khoản đã xác minh
        const accountsData = await getVerifiedAccounts();
        const accounts = accountsData.accounts || [];
        
        // Thêm một số tài khoản mẫu chưa xác minh
        const mockPendingUsers = [
          {
            id: 101,
            email: "pending1@example.com",
            full_name: "Đỗ Thị D",
            verified_at: null,
            status: "pending"
          },
          {
            id: 102,
            email: "pending2@example.com",
            full_name: "Phạm Văn E",
            verified_at: null,
            status: "pending"
          },
          {
            id: 103,
            email: "pending3@example.com",
            full_name: "Hoàng Thị F",
            verified_at: null,
            status: "pending"
          },
          {
            id: 104,
            email: "pending4@example.com",
            full_name: "Vũ Văn G",
            verified_at: null,
            status: "pending"
          },
          {
            id: 105,
            email: "pending5@example.com",
            full_name: "Ngô Thị H",
            verified_at: null,
            status: "pending"
          }
        ];
        
        setUsers([...accounts, ...mockPendingUsers]);
      } catch (error) {
        console.error("Error fetching users:", error);
        
        // Sử dụng dữ liệu mẫu nếu API chưa được triển khai
        setUsers([
          {
            id: 1,
            email: "user1@example.com",
            full_name: "Nguyễn Văn A",
            verified_at: "2024-05-15T10:30:00",
            status: "verified"
          },
          {
            id: 2,
            email: "user2@example.com",
            full_name: "Trần Thị B",
            verified_at: "2024-05-14T14:45:00",
            status: "verified"
          },
          {
            id: 3,
            email: "user3@example.com",
            full_name: "Lê Văn C",
            verified_at: "2024-05-13T09:15:00",
            status: "verified"
          },
          {
            id: 101,
            email: "pending1@example.com",
            full_name: "Đỗ Thị D",
            verified_at: null,
            status: "pending"
          },
          {
            id: 102,
            email: "pending2@example.com",
            full_name: "Phạm Văn E",
            verified_at: null,
            status: "pending"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Lọc người dùng theo từ khóa tìm kiếm
  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Hàm định dạng ngày giờ
  const formatDateTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return "Chưa xác minh";
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Xử lý xóa người dùng (giả lập)
  const handleDeleteUser = (userId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      // Trong thực tế, bạn sẽ gọi API để xóa người dùng
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // Xử lý chỉnh sửa người dùng (giả lập)
  const handleEditUser = (userId: number) => {
    // Trong thực tế, bạn sẽ chuyển hướng đến trang chỉnh sửa hoặc mở modal
    alert(`Chỉnh sửa người dùng có ID: ${userId}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Quản lý người dùng</h1>
      
      {/* Thanh tìm kiếm */}
      <div className="mt-6 flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Thêm người dùng
        </button>
      </div>

      {/* Bảng người dùng */}
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
                        Họ và tên
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ngày xác minh
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Trạng thái
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
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          Không tìm thấy người dùng nào
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.full_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(user.verified_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === "verified" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {user.status === "verified" ? "Đã xác minh" : "Chưa xác minh"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditUser(user.id)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
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
                {Math.min(indexOfLastItem, filteredUsers.length)}
              </span>{" "}
              trong tổng số <span className="font-medium">{filteredUsers.length}</span> người dùng
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
