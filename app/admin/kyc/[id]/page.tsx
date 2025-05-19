/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    CheckCircleIcon,
    XCircleIcon,
    ArrowLeftIcon,
    DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import {
    useGetKYCRequestDetailsQuery,
    useApproveKYCMutation,
    useRejectKYCMutation,
    useManualVerifyKYCMutation,
} from "@/store/services/adminApi";
import { useAppDispatch } from "@/store/hooks";
import { addNotification } from "@/store/slices/notificationSlice";

export default function KYCDetail() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const kycId = Number(params.id);

    // Sử dụng RTK Query hooks
    const {
        data: kycRequest,
        isLoading,
        error,
        refetch,
    } = useGetKYCRequestDetailsQuery(kycId);
    const [approveKYC, { isLoading: isApproving }] = useApproveKYCMutation();
    const [rejectKYC, { isLoading: isRejecting }] = useRejectKYCMutation();
    const [manualVerifyKYC, { isLoading: isManualVerifying }] =
        useManualVerifyKYCMutation();

    // Xử lý lỗi
    useEffect(() => {
        if (error) {
            dispatch(
                addNotification({
                    message: "Không thể tải thông tin yêu cầu KYC",
                    type: "error",
                    duration: 5000,
                })
            );
        }
    }, [error, dispatch]);

    // Hàm định dạng ngày giờ
    const formatDateTime = (dateTimeStr: string | undefined) => {
        if (!dateTimeStr) return "N/A";
        const date = new Date(dateTimeStr);
        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    // Xử lý phê duyệt yêu cầu KYC
    const handleApproveKYC = async () => {
        if (
            window.confirm("Bạn có chắc chắn muốn phê duyệt yêu cầu KYC này?")
        ) {
            try {
                await approveKYC(kycId).unwrap();
                dispatch(
                    addNotification({
                        message: "Phê duyệt KYC thành công",
                        type: "success",
                        duration: 3000,
                    })
                );
                refetch();
            } catch (error) {
                console.error("Approve KYC error:", error);
                dispatch(
                    addNotification({
                        message: "Không thể phê duyệt yêu cầu KYC",
                        type: "error",
                        duration: 5000,
                    })
                );
            }
        }
    };

    // Xử lý từ chối yêu cầu KYC
    const handleRejectKYC = async () => {
        const reason = prompt("Vui lòng nhập lý do từ chối:");
        if (reason) {
            try {
                await rejectKYC({ kycId, reason }).unwrap();
                dispatch(
                    addNotification({
                        message: "Từ chối KYC thành công",
                        type: "success",
                        duration: 3000,
                    })
                );
                refetch();
            } catch (error) {
                console.error("Reject KYC error:", error);
                dispatch(
                    addNotification({
                        message: "Không thể từ chối yêu cầu KYC",
                        type: "error",
                        duration: 5000,
                    })
                );
            }
        }
    };

    // Xử lý xác minh thủ công yêu cầu KYC
    const handleManualVerifyKYC = async () => {
        if (
            window.confirm(
                "Bạn có chắc chắn muốn xác minh thủ công yêu cầu KYC này? Hệ thống sẽ bỏ qua tất cả các kiểm tra tự động."
            )
        ) {
            try {
                await manualVerifyKYC(kycId).unwrap();
                dispatch(
                    addNotification({
                        message: "Xác minh thủ công KYC thành công",
                        type: "success",
                        duration: 3000,
                    })
                );
                refetch();
            } catch (error) {
                console.error("Manual verify KYC error:", error);
                dispatch(
                    addNotification({
                        message: "Không thể xác minh thủ công yêu cầu KYC",
                        type: "error",
                        duration: 5000,
                    })
                );
            }
        }
    };

    // Quay lại trang danh sách
    const handleGoBack = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!kycRequest) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">
                    Không tìm thấy thông tin yêu cầu KYC
                </p>
                <button
                    onClick={handleGoBack}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Chi tiết yêu cầu KYC
                </h1>
                <button
                    onClick={handleGoBack}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Quay lại
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Thông tin người dùng
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Chi tiết về người yêu cầu xác minh KYC
                        </p>
                    </div>
                    <div>
                        <span
                            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                kycRequest.status === "verified"
                                    ? "bg-green-100 text-green-800"
                                    : kycRequest.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                            {kycRequest.status === "verified"
                                ? "Đã xác minh"
                                : kycRequest.status === "rejected"
                                ? "Đã từ chối"
                                : "Đang chờ"}
                        </span>
                    </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Họ và tên
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {kycRequest.identity_info?.full_name ||
                                    "Chưa có thông tin"}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Email
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {kycRequest.email}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Số CCCD
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {kycRequest.identity_info?.id_number ||
                                    "Chưa có thông tin"}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Ngày sinh
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {kycRequest.identity_info?.date_of_birth ||
                                    "Chưa có thông tin"}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Giới tính
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {kycRequest.identity_info?.gender ||
                                    "Chưa có thông tin"}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Quốc tịch
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {kycRequest.identity_info?.nationality ||
                                    "Chưa có thông tin"}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Ngày cấp
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {kycRequest.identity_info?.issue_date ||
                                    "Chưa có thông tin"}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Ngày hết hạn
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {kycRequest.identity_info?.expiry_date ||
                                    "Chưa có thông tin"}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Thông tin xác minh
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Chi tiết về quá trình xác minh KYC
                    </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Ngày gửi yêu cầu
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {formatDateTime(kycRequest.created_at)}
                            </dd>
                        </div>
                        {kycRequest.verified_at && (
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Ngày xác minh
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {formatDateTime(kycRequest.verified_at)}
                                </dd>
                            </div>
                        )}
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Điểm số liveness
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {kycRequest.liveness_score !== null &&
                                kycRequest.liveness_score !== undefined
                                    ? kycRequest.liveness_score.toFixed(2)
                                    : "Chưa có thông tin"}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Số lần nháy mắt
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {kycRequest.blink_count !== null &&
                                kycRequest.blink_count !== undefined
                                    ? kycRequest.blink_count
                                    : "Chưa có thông tin"}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Khuôn mặt khớp
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {kycRequest.face_match !== null &&
                                kycRequest.face_match !== undefined
                                    ? kycRequest.face_match
                                        ? "Có"
                                        : "Không"
                                    : "Chưa có thông tin"}
                            </dd>
                        </div>
                        {kycRequest.rejection_reason && (
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Lý do từ chối
                                </dt>
                                <dd className="mt-1 text-sm text-red-600 sm:mt-0 sm:col-span-2">
                                    {kycRequest.rejection_reason}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>

            {/* Ảnh CCCD và ảnh selfie */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Hình ảnh xác minh
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Ảnh CCCD và ảnh chân dung
                    </p>
                </div>
                <div className="border-t border-gray-200 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {kycRequest.id_card_front && (
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">
                                CCCD - Mặt trước
                            </p>
                            <div className="h-48 w-full border rounded overflow-hidden flex items-center justify-center">
                                <img
                                    src={`http://localhost:5000${kycRequest.id_card_front}`}
                                    alt="CCCD mặt trước"
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        </div>
                    )}
                    {kycRequest.id_card_back && (
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">
                                CCCD - Mặt sau
                            </p>
                            <div className="h-48 w-full border rounded overflow-hidden flex items-center justify-center">
                                <img
                                    src={`http://localhost:5000${kycRequest.id_card_back}`}
                                    alt="CCCD mặt sau"
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        </div>
                    )}
                    {(kycRequest.selfie || kycRequest.selfie_path) && (
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">
                                Ảnh chân dung
                            </p>
                            <div className="h-48 w-full border rounded overflow-hidden flex items-center justify-center">
                                <img
                                    src={`http://localhost:5000${
                                        kycRequest.selfie ||
                                        kycRequest.selfie_path
                                    }`}
                                    alt="Ảnh chân dung"
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Các nút hành động */}
            {kycRequest.status === "pending" && (
                <div className="flex flex-wrap justify-end space-x-4">
                    <button
                        onClick={handleManualVerifyKYC}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={isManualVerifying}
                    >
                        <DocumentCheckIcon className="h-5 w-5 mr-2" />
                        Xác minh thủ công
                    </button>
                    <button
                        onClick={handleApproveKYC}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        disabled={isApproving}
                    >
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Phê duyệt
                    </button>
                    <button
                        onClick={handleRejectKYC}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        disabled={isRejecting}
                    >
                        <XCircleIcon className="h-5 w-5 mr-2" />
                        Từ chối
                    </button>
                </div>
            )}
        </div>
    );
}
