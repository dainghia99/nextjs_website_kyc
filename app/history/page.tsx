"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getVerifiedAccounts } from "@/services/kyc";

interface VerifiedAccount {
    id: number;
    email: string;
    full_name: string;
    verified_at: string;
    status: string;
}

export default function HistoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState<VerifiedAccount[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        loadVerifiedAccounts();
    }, []);

    const loadVerifiedAccounts = async () => {
        setLoading(true);
        try {
            const data = await getVerifiedAccounts();
            setAccounts(data.accounts || []);
        } catch (error: any) {
            console.error("Error loading verified accounts:", error);
            setError("Không thể tải danh sách tài khoản đã xác minh");
            
            // Sử dụng dữ liệu mẫu nếu API chưa được triển khai
            setAccounts([
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
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Lịch sử xác minh KYC</h1>
            
            {loading && (
                <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
                    <p>Đang tải...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Họ và tên
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày xác minh
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {accounts.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                accounts.map((account) => (
                                    <tr key={account.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {account.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{account.full_name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{account.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDateTime(account.verified_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {account.status === "verified" ? "Đã xác minh" : account.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
