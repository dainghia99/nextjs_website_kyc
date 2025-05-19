/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { getVerifiedAccounts } from "@/services/kyc";

export default function StatisticsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        verifiedUsers: 0,
        pendingUsers: 0,
        rejectedUsers: 0,
        verificationRate: 0,
        monthlyStats: [] as {
            month: string;
            verified: number;
            pending: number;
            rejected: number;
        }[],
        dailyStats: [] as {
            date: string;
            verified: number;
            pending: number;
            rejected: number;
        }[],
    });

    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true);
            try {
                // Lấy danh sách tài khoản đã xác minh
                const accountsData = await getVerifiedAccounts();
                const accounts = accountsData.accounts || [];

                // Tạm thời: Tạo dữ liệu thống kê mẫu
                // Trong thực tế, bạn sẽ có API riêng để lấy dữ liệu thống kê

                // Tạo dữ liệu thống kê theo tháng
                const monthlyStats = [
                    { month: "01/2024", verified: 5, pending: 3, rejected: 1 },
                    { month: "02/2024", verified: 8, pending: 4, rejected: 2 },
                    { month: "03/2024", verified: 12, pending: 5, rejected: 3 },
                    { month: "04/2024", verified: 15, pending: 6, rejected: 2 },
                    {
                        month: "05/2024",
                        verified: accounts.length,
                        pending: 8,
                        rejected: 3,
                    },
                ];

                // Tạo dữ liệu thống kê theo ngày (30 ngày gần nhất)
                const dailyStats = [];
                const today = new Date();

                for (let i = 29; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);

                    // Tạo số liệu ngẫu nhiên cho mỗi ngày
                    const verified =
                        i === 0
                            ? accounts.length
                            : Math.floor(Math.random() * 3);
                    const pending = Math.floor(Math.random() * 5);
                    const rejected = Math.floor(Math.random() * 2);

                    dailyStats.push({
                        date: date.toLocaleDateString("vi-VN"),
                        verified,
                        pending,
                        rejected,
                    });
                }

                setStats({
                    totalUsers: accounts.length + 8 + 3, // Giả sử có thêm 8 người dùng chưa xác minh và 3 người bị từ chối
                    verifiedUsers: accounts.length,
                    pendingUsers: 8,
                    rejectedUsers: 3,
                    verificationRate: Math.round(
                        (accounts.length / (accounts.length + 8 + 3)) * 100
                    ),
                    monthlyStats,
                    dailyStats,
                });
            } catch (error) {
                console.error("Error fetching statistics:", error);

                // Sử dụng dữ liệu mẫu nếu API chưa được triển khai
                const monthlyStats = [
                    { month: "01/2024", verified: 5, pending: 3, rejected: 1 },
                    { month: "02/2024", verified: 8, pending: 4, rejected: 2 },
                    { month: "03/2024", verified: 12, pending: 5, rejected: 3 },
                    { month: "04/2024", verified: 15, pending: 6, rejected: 2 },
                    { month: "05/2024", verified: 18, pending: 8, rejected: 3 },
                ];

                const dailyStats = [];
                const today = new Date();

                for (let i = 29; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);

                    dailyStats.push({
                        date: date.toLocaleDateString("vi-VN"),
                        verified: Math.floor(Math.random() * 3),
                        pending: Math.floor(Math.random() * 5),
                        rejected: Math.floor(Math.random() * 2),
                    });
                }

                setStats({
                    totalUsers: 29,
                    verifiedUsers: 18,
                    pendingUsers: 8,
                    rejectedUsers: 3,
                    verificationRate: 62,
                    monthlyStats,
                    dailyStats,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">Thống kê</h1>

            {loading ? (
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            ) : (
                <>
                    {/* Thống kê tổng quan */}
                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
                                        <svg
                                            className="h-6 w-6 text-orange-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Tổng số người dùng
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {stats.totalUsers}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                        <svg
                                            className="h-6 w-6 text-green-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Đã xác minh KYC
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {stats.verifiedUsers}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                        <svg
                                            className="h-6 w-6 text-yellow-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Đang chờ xác minh
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {stats.pendingUsers}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                                        <svg
                                            className="h-6 w-6 text-red-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Đã từ chối
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {stats.rejectedUsers}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tỷ lệ xác minh */}
                    <div className="mt-8 bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            Tỷ lệ xác minh KYC
                        </h2>
                        <div className="mt-4">
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-orange-600 bg-orange-200">
                                            Tiến độ
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-orange-600">
                                            {stats.verificationRate}%
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-orange-200">
                                    <div
                                        style={{
                                            width: `${stats.verificationRate}%`,
                                        }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Biểu đồ thống kê theo tháng */}
                    <div className="mt-8 bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            Thống kê theo tháng
                        </h2>
                        <div className="mt-4">
                            <div
                                className="relative"
                                style={{ height: "300px" }}
                            >
                                <div className="flex h-64">
                                    {stats.monthlyStats.map((month, index) => (
                                        <div
                                            key={index}
                                            className="flex-1 flex flex-col justify-end items-center"
                                        >
                                            <div className="relative w-full flex flex-col items-center">
                                                <div className="h-32 w-full flex flex-col-reverse">
                                                    <div
                                                        className="bg-red-500"
                                                        style={{
                                                            height: `${
                                                                (month.rejected /
                                                                    (month.verified +
                                                                        month.pending +
                                                                        month.rejected)) *
                                                                100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                    <div
                                                        className="bg-yellow-500"
                                                        style={{
                                                            height: `${
                                                                (month.pending /
                                                                    (month.verified +
                                                                        month.pending +
                                                                        month.rejected)) *
                                                                100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                    <div
                                                        className="bg-green-500"
                                                        style={{
                                                            height: `${
                                                                (month.verified /
                                                                    (month.verified +
                                                                        month.pending +
                                                                        month.rejected)) *
                                                                100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="absolute bottom-0 w-full flex justify-center">
                                                    <div className="text-xs font-medium text-gray-500 -mb-6">
                                                        {month.month}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 bg-green-500 mr-1"></div>
                                                    <span>
                                                        {month.verified}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 bg-yellow-500 mr-1"></div>
                                                    <span>{month.pending}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 bg-red-500 mr-1"></div>
                                                    <span>
                                                        {month.rejected}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
                            </div>
                            <div className="mt-4 flex justify-center">
                                <div className="flex items-center mr-4">
                                    <div className="w-3 h-3 bg-green-500 mr-1"></div>
                                    <span className="text-sm text-gray-600">
                                        Đã xác minh
                                    </span>
                                </div>
                                <div className="flex items-center mr-4">
                                    <div className="w-3 h-3 bg-yellow-500 mr-1"></div>
                                    <span className="text-sm text-gray-600">
                                        Đang chờ
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-red-500 mr-1"></div>
                                    <span className="text-sm text-gray-600">
                                        Đã từ chối
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bảng thống kê theo ngày */}
                    <div className="mt-8 bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            Thống kê 7 ngày gần nhất
                        </h2>
                        <div className="mt-4 flex flex-col">
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
                                                        Ngày
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Đã xác minh
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Đang chờ
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Đã từ chối
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Tổng
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {stats.dailyStats
                                                    .slice(-7)
                                                    .map((day, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {day.date}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">
                                                                    {
                                                                        day.verified
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">
                                                                    {
                                                                        day.pending
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">
                                                                    {
                                                                        day.rejected
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {day.verified +
                                                                    day.pending +
                                                                    day.rejected}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
