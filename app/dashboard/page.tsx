"use client";
import { useState, useEffect } from "react";
import { useGetVerifiedAccountsQuery } from "@/store/services/kycApi";
import { useAppDispatch } from "@/store/hooks";
import { addNotification } from "@/store/slices/notificationSlice";
import { VerifiedAccount } from "@/store/services/kycApi";

export default function Dashboard() {
    const dispatch = useAppDispatch();
    
    // Sử dụng RTK Query hook thay vì gọi API trực tiếp
    const { data, isLoading, error, refetch } = useGetVerifiedAccountsQuery();
    
    // Dữ liệu mẫu để sử dụng khi API không trả về dữ liệu hoặc gặp lỗi
    const sampleAccounts: VerifiedAccount[] = [
        {
            id: 1,
            email: "user1@example.com",
            full_name: "Nguyễn Văn A",
            verified_at: "2024-05-15T10:30:00",
            status: "verified",
        },
        {
            id: 2,
            email: "user2@example.com",
            full_name: "Trần Thị B",
            verified_at: "2024-05-14T14:45:00",
            status: "verified",
        },
        {
            id: 3,
            email: "user3@example.com",
            full_name: "Lê Văn C",
            verified_at: "2024-05-13T09:15:00",
            status: "verified",
        },
    ];
    
    // Dữ liệu hiển thị - ưu tiên dữ liệu từ API, nếu không có thì dùng dữ liệu mẫu
    const accounts = data?.accounts || sampleAccounts;
    
    // Xử lý lỗi
    useEffect(() => {
        if (error) {
            dispatch(addNotification({
                message: "Không thể tải danh sách tài khoản đã xác minh",
                type: 'error',
                duration: 5000,
            }));
        }
    }, [error, dispatch]);

    // Hàm định dạng ngày giờ
    const formatDateTime = (dateTimeStr: string) => {
        const date = new Date(dateTimeStr);
        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };
    
    // Hàm làm mới dữ liệu
    const handleRefresh = () => {
        refetch();
        dispatch(addNotification({
            message: "Đang làm mới dữ liệu...",
            type: 'info',
            duration: 2000,
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* KYC Accounts List */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Danh sách tài khoản đã KYC
                    </h1>
                    <button 
                        onClick={handleRefresh}
                        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                                <span>Đang tải...</span>
                            </>
                        ) : (
                            <span>Làm mới</span>
                        )}
                    </button>
                </div>

                {isLoading && (
                    <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
                        <p>Đang tải...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Không thể tải danh sách tài khoản đã xác minh
                    </div>
                )}

                <div className="grid gap-6">
                    {accounts.map((account) => (
                        <div
                            key={account.id}
                            className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-bold text-gray-800">
                                    {account.full_name}
                                </h3>
                                <p className="text-gray-600">{account.email}</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    Ngày xác thực:{" "}
                                    {formatDateTime(account.verified_at)}
                                </p>
                            </div>
                            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                                {account.status === "verified"
                                    ? "Đã xác minh"
                                    : account.status}
                            </div>
                        </div>
                    ))}

                    {accounts.length === 0 && !isLoading && (
                        <div className="text-center py-8 text-gray-500">
                            Không có tài khoản nào đã xác minh KYC
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
