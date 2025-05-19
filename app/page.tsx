"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getKYCStatus } from "@/services/kyc";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [kycStatus, setKycStatus] = useState<string>("pending");

    useEffect(() => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (!token || !userStr) {
            setIsLoggedIn(false);
            setLoading(false);
            return;
        }

        try {
            const userData = JSON.parse(userStr);
            setUser(userData);
            setIsLoggedIn(true);
            setKycStatus(userData.kyc_status || "pending");

            // Lấy trạng thái KYC từ backend
            fetchKYCStatus();
        } catch (error) {
            console.error("Error parsing user data:", error);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchKYCStatus = async () => {
        try {
            const response = await getKYCStatus();
            if (response && response.status) {
                setKycStatus(response.status);

                // Cập nhật thông tin user trong localStorage
                const userStr = localStorage.getItem("user");
                if (userStr) {
                    const userData = JSON.parse(userStr);
                    userData.kyc_status = response.status;
                    localStorage.setItem("user", JSON.stringify(userData));
                    setUser(userData);
                }
            }
        } catch (error) {
            console.error("Error fetching KYC status:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <div className="text-center max-w-2xl">
                    <Image
                        src="/Logo_DAI_NAM.png"
                        alt="Logo"
                        width={120}
                        height={120}
                        className="mx-auto mb-8"
                    />
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Chào mừng đến với Hệ thống Xác thực KYC
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Vui lòng đăng nhập để sử dụng các tính năng của hệ thống
                        xác thực danh tính khách hàng.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/sign-in"
                            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            href="/auth/sign-up"
                            className="bg-white text-orange-500 border border-orange-500 px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors"
                        >
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <Image
                        src="/Logo_DAI_NAM.png"
                        alt="Logo"
                        width={100}
                        height={100}
                        className="rounded-full bg-white border-4 border-orange-500"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Xin chào, {user?.email}
                        </h1>
                        <div
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                kycStatus === "verified"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                            {kycStatus === "verified"
                                ? "Đã xác minh KYC"
                                : "Chưa xác thực KYC"}
                        </div>
                    </div>
                </div>
            </div>

            {kycStatus !== "verified" && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Xác minh danh tính của bạn
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Để sử dụng đầy đủ tính năng của hệ thống, vui lòng hoàn
                        thành quy trình xác minh KYC.
                    </p>
                    <Link
                        href="/verify"
                        className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors inline-block"
                    >
                        Xác minh ngay
                    </Link>
                </div>
            )}

            {kycStatus === "verified" && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Tài khoản đã được xác minh
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Cảm ơn bạn đã hoàn thành quy trình xác minh KYC. Bạn có
                        thể sử dụng đầy đủ tính năng của hệ thống.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        {/* <Link
                            href="/dashboard"
                            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors inline-block"
                        >
                            Xem Dashboard
                        </Link> */}
                        <Link
                            href="/profile"
                            className="bg-white text-orange-500 border border-orange-500 px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors inline-block"
                        >
                            Xem hồ sơ
                        </Link>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Xác thực danh tính
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Xác minh danh tính của bạn thông qua CCCD và xác minh
                        khuôn mặt.
                    </p>
                    <Link
                        href="/verify"
                        className="text-orange-500 font-medium hover:text-orange-600"
                    >
                        Đi đến trang xác thực
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Lịch sử xác minh
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Xem lịch sử xác minh KYC và trạng thái của các tài
                        khoản.
                    </p>
                    <Link
                        href="/history"
                        className="text-orange-500 font-medium hover:text-orange-600"
                    >
                        Xem lịch sử
                    </Link>
                </div>
            </div>
        </div>
    );
}
