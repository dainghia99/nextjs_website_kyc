/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectUser, selectIsLoggedIn } from "@/store/selectors/userSelectors";
import { useGetKycStatusQuery } from "@/store/services/kycApi";
import { useLogoutMutation } from "@/store/services/authApi";
import {
    initializeUserFromStorage,
    logout as logoutAction,
} from "@/store/slices/userSlice";
import { addNotification } from "@/store/slices/notificationSlice";
import { IdentityInfo } from "@/store/services/kycApi";

export default function Profile() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Lấy thông tin user từ Redux store
    const user = useAppSelector(selectUser);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    // Gọi API sử dụng RTK Query
    const {
        data: kycData,
        isLoading,
        error: kycError,
    } = useGetKycStatusQuery();
    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

    // Khởi tạo user từ localStorage
    useEffect(() => {
        dispatch(initializeUserFromStorage());
    }, [dispatch]);

    // Chuyển hướng về trang đăng nhập nếu chưa đăng nhập
    useEffect(() => {
        if (!isLoggedIn && !isLoading) {
            router.replace("/auth/sign-in");
        }
    }, [isLoggedIn, router, isLoading]);

    // Hiển thị thông báo lỗi
    useEffect(() => {
        if (kycError) {
            dispatch(
                addNotification({
                    message: "Không thể tải thông tin KYC",
                    type: "error",
                    duration: 5000,
                })
            );
        }
    }, [kycError, dispatch]);

    const handleLogout = async () => {
        try {
            // Gọi API logout
            await logout().unwrap();

            // Xóa dữ liệu trong localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Cập nhật Redux store
            dispatch(logoutAction());

            // Hiển thị thông báo
            dispatch(
                addNotification({
                    message: "Đăng xuất thành công",
                    type: "success",
                    duration: 3000,
                })
            );

            // Chuyển hướng
            router.replace("/auth/sign-in");
        } catch (error) {
            console.error("Logout error:", error);

            // Hiển thị thông báo lỗi
            dispatch(
                addNotification({
                    message: "Đã xảy ra lỗi khi đăng xuất, vui lòng thử lại",
                    type: "error",
                    duration: 5000,
                })
            );

            // Vẫn xóa thông tin người dùng ở client và chuyển hướng
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            dispatch(logoutAction());
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

    // Lấy thông tin KYC từ Redux hoặc từ API
    const identityInfo: IdentityInfo | undefined =
        kycData?.identity_info || user?.identity_info;

    // Loading state
    if (isLoading || !user) {
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
                <div className="bg-white rounded-lg shadow-md p-6 relative">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
                        </div>
                    )}

                    {kycError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            Không thể tải thông tin KYC
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
                                {identityInfo?.full_name || user.email}
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

                        {identityInfo && (
                            <>
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-600">
                                        Họ và tên
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {identityInfo.full_name}
                                    </span>
                                </div>
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-600">
                                        Số CCCD
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {identityInfo.id_number}
                                    </span>
                                </div>
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-600">
                                        Ngày sinh
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {formatDate(identityInfo.date_of_birth)}
                                    </span>
                                </div>
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-600">
                                        Giới tính
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {identityInfo.gender}
                                    </span>
                                </div>
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-600">
                                        Quốc tịch
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {identityInfo.nationality}
                                    </span>
                                </div>
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-600">
                                        Ngày cấp
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {formatDate(identityInfo.issue_date)}
                                    </span>
                                </div>
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-600">
                                        Ngày hết hạn
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {formatDate(identityInfo.expiry_date)}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 disabled:bg-orange-300"
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? "Đang xử lý..." : "Đăng xuất"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
