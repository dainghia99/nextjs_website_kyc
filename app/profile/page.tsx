"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";
import { getKYCStatus } from "@/services/kyc";

interface UserInfo {
    id: number;
    email: string;
    kyc_status: string;
    identity_info?: {
        id_number: string;
        full_name: string;
        date_of_birth: string;
        gender: string;
        nationality: string;
        issue_date: string;
        expiry_date: string;
    };
}

export default function Profile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        // Lấy thông tin người dùng từ localStorage
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.replace("/auth/sign-in");
            return;
        }

        const userData = JSON.parse(userStr);
        setUser(userData);

        // Lấy thông tin KYC từ backend
        loadKYCInfo();
    }, [router]);

    const loadKYCInfo = async () => {
        setLoading(true);
        try {
            const kycData = await getKYCStatus();

            // Cập nhật thông tin người dùng với dữ liệu KYC
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const userData = JSON.parse(userStr);
                setUser({
                    ...userData,
                    identity_info: kycData.identity_info,
                });
            }
        } catch (error) {
            console.error("Error loading KYC info:", error);
            setError("Không thể tải thông tin KYC");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            // Gọi API logout và xóa dữ liệu đăng nhập
            await logout();
            router.replace("/auth/sign-in");
        } catch (error) {
            console.error("Logout error:", error);
            // Vẫn chuyển hướng về trang đăng nhập ngay cả khi API gặp lỗi
            router.replace("/auth/sign-in");
        }
    };

    // Định dạng ngày tháng
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(date);
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
                <p>Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col items-center space-y-4">
                        <Image
                            src="/Logo_DAI_NAM.png"
                            alt="Avatar"
                            width={100}
                            height={100}
                            className="rounded-full bg-white border-4 border-orange-500"
                        />
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {user.identity_info?.full_name || user.email}
                            </h2>
                            <p className="text-gray-600">{user.email}</p>
                            <div
                                className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                    user.kyc_status === "verified"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                                {user.kyc_status === "verified"
                                    ? "Đã xác minh"
                                    : "Chưa xác minh"}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between py-3 border-b">
                            <span className="text-gray-600">Email</span>
                            <span className="font-medium text-gray-800">
                                {user.email}
                            </span>
                        </div>

                        {user.identity_info && (
                            <>
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-600">
                                        Họ và tên
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {user.identity_info.full_name}
                                    </span>
                                </div>
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-600">
                                        Số CCCD
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {user.identity_info.id_number}
                                    </span>
                                </div>
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-600">
                                        Ngày sinh
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {formatDate(
                                            user.identity_info.date_of_birth
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-600">
                                        Giới tính
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {user.identity_info.gender}
                                    </span>
                                </div>
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-600">
                                        Quốc tịch
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {user.identity_info.nationality}
                                    </span>
                                </div>
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-600">
                                        Ngày cấp
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {formatDate(
                                            user.identity_info.issue_date
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-600">
                                        Ngày hết hạn
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {formatDate(
                                            user.identity_info.expiry_date
                                        )}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
