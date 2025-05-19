/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import {
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
    useGetUsersQuery,
    useDeleteUserMutation,
} from "@/store/services/adminApi";
import { useAppDispatch } from "@/store/hooks";
import { addNotification } from "@/store/slices/notificationSlice";

export default function UsersManagement() {
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Sử dụng RTK Query hooks
    const { data, isLoading, error, refetch } = useGetUsersQuery({
        page: currentPage,
        perPage: itemsPerPage,
        search: searchTerm,
    });

    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    // Lấy dữ liệu
    const users = data?.users || [];
    const totalUsers = data?.total || 0;
    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    // Xử lý lỗi
    useEffect(() => {
        if (error) {
            dispatch(
                addNotification({
                    message: "Không thể tải danh sách người dùng",
                    type: "error",
                    duration: 5000,
                })
            );
        }
    }, [error, dispatch]);

    // Định dạng ngày tháng
    const formatDateTime = (dateTimeStr: string | null) => {
        if (!dateTimeStr) return "Chưa xác minh";
        const date = new Date(dateTimeStr);
        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    // Xử lý xóa người dùng
    const handleDeleteUser = async (userId: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            try {
                await deleteUser(userId).unwrap();
                dispatch(
                    addNotification({
                        message: "Xóa người dùng thành công",
                        type: "success",
                        duration: 3000,
                    })
                );
                refetch(); // Làm mới danh sách sau khi xóa
            } catch (error) {
                console.error("Delete user error:", error);
                dispatch(
                    addNotification({
                        message: "Không thể xóa người dùng",
                        type: "error",
                        duration: 5000,
                    })
                );
            }
        }
    };

    // Xử lý chỉnh sửa người dùng
    const handleEditUser = (userId: number) => {
        alert(`Chỉnh sửa người dùng có ID: ${userId}`);
        // Trong thực tế, bạn sẽ chuyển hướng đến trang chỉnh sửa hoặc mở modal
    };

    // Xử lý thay đổi trang
    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Xử lý tìm kiếm
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
        // Query tự động được gửi nhờ useGetUsersQuery phụ thuộc vào searchTerm
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">
                Quản lý người dùng
            </h1>

            {/* Thanh tìm kiếm */}
            <div className="mt-6 flex justify-between items-center">
                <form
                    onSubmit={handleSearch}
                    className="relative flex-1 max-w-md"
                >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        placeholder="Tìm kiếm người dùng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
                <button
                    onClick={() => refetch()}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    disabled={isLoading}
                >
                    {isLoading ? "Đang tải..." : "Làm mới"}
                </button>
            </div>

            {/* Bảng người dùng */}
            {isLoading ? (
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
                                        {users.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                                >
                                                    Không tìm thấy người dùng
                                                    nào
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user) => (
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
                                                        {formatDateTime(
                                                            user.verified_at
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                user.status ===
                                                                "verified"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                        >
                                                            {user.status ===
                                                            "verified"
                                                                ? "Đã xác minh"
                                                                : "Chưa xác minh"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() =>
                                                                handleEditUser(
                                                                    user.id
                                                                )
                                                            }
                                                            className="text-blue-500 hover:text-blue-700 mr-3"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteUser(
                                                                    user.id
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-700"
                                                            disabled={
                                                                isDeleting
                                                            }
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
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || isLoading}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                        ).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                disabled={isLoading}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                                    page === currentPage
                                        ? "bg-orange-50 text-orange-600 border-orange-500 z-10"
                                        : "text-gray-500 hover:bg-gray-50"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || isLoading}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
}
