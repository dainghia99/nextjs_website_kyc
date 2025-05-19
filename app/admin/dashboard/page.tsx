/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import {
    UserGroupIcon,
    IdentificationIcon,
    CheckCircleIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import {
    useGetStatisticsQuery,
    useGetKYCRequestsQuery,
} from "@/store/services/adminApi";
import { useAppDispatch } from "@/store/hooks";
import { addNotification } from "@/store/slices/notificationSlice";

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
    color: string;
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    color,
}: StatCardProps) {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
                        <Icon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                        />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                {title}
                            </dt>
                            <dd>
                                <div className="text-lg font-medium text-gray-900">
                                    {value}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div className={`bg-gray-50 px-5 py-3`}>
                <div className="text-sm">
                    <span className="font-medium text-gray-500">
                        {description}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const dispatch = useAppDispatch();

    // Sử dụng RTK Query hooks thay vì gọi API trực tiếp
    const {
        data: statsData,
        isLoading: statsLoading,
        error: statsError,
        refetch: refetchStats,
    } = useGetStatisticsQuery();

    const {
        data: kycData,
        isLoading: kycLoading,
        error: kycError,
        refetch: refetchKYC,
    } = useGetKYCRequestsQuery({ page: 1, perPage: 5, status: "verified" });

    // Giá trị mặc định cho thống kê khi API chưa trả về dữ liệu
    const stats = statsData || {
        totalUsers: 0,
        verifiedUsers: 0,
        pendingUsers: 0,
        verificationRate: "0%",
    };

    // Dữ liệu hiển thị - ưu tiên dữ liệu từ API, nếu không có thì dùng dữ liệu mẫu
    const recentAccounts = kycData?.requests?.slice(0, 5) || [];

    // Loading state tổng hợp
    const loading = statsLoading || kycLoading;

    // Xử lý lỗi
    if (statsError || kycError) {
        const error = statsError || kycError;
        dispatch(
            addNotification({
                message: "Không thể tải dữ liệu dashboard",
                type: "error",
                duration: 5000,
                error,
            })
        );
    }

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
        refetchStats();
        refetchKYC();
        dispatch(
            addNotification({
                message: "Đang làm mới dữ liệu...",
                type: "info",
                duration: 2000,
            })
        );
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

            {loading ? (
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            ) : (
                <>
                    {/* Thống kê */}
                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Tổng số người dùng"
                            value={stats.totalUsers}
                            description="Tổng số tài khoản đã đăng ký"
                            icon={UserGroupIcon}
                            color="bg-blue-500"
                        />
                        <StatCard
                            title="Đã xác minh KYC"
                            value={stats.verifiedUsers}
                            description="Số người dùng đã xác minh KYC"
                            icon={CheckCircleIcon}
                            color="bg-green-500"
                        />
                        <StatCard
                            title="Chưa xác minh"
                            value={stats.pendingUsers}
                            description="Số người dùng chưa xác minh KYC"
                            icon={ClockIcon}
                            color="bg-yellow-500"
                        />
                        <StatCard
                            title="Tỷ lệ xác minh"
                            value={stats.verificationRate}
                            description="Tỷ lệ người dùng đã xác minh KYC"
                            icon={IdentificationIcon}
                            color="bg-orange-500"
                        />
                    </div>

                    {/* Danh sách tài khoản gần đây */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                Tài khoản xác minh gần đây
                            </h2>
                            <button
                                onClick={handleRefresh}
                                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                                        <span>Đang tải...</span>
                                    </>
                                ) : (
                                    <span>Làm mới</span>
                                )}
                            </button>
                        </div>
                        <div className="flex flex-col">
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
                                                        Người dùng
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
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {recentAccounts.length === 0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan={4}
                                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                                        >
                                                            Không có dữ liệu
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    recentAccounts.map(
                                                        (account) => (
                                                            <tr
                                                                key={account.id}
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {
                                                                            account.full_name
                                                                        }
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-500">
                                                                        {
                                                                            account.email
                                                                        }
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {formatDateTime(
                                                                        account.verified_at ||
                                                                            account.submitted_at
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                        {account.status ===
                                                                        "verified"
                                                                            ? "Đã xác minh"
                                                                            : account.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )
                                                )}
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
