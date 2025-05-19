/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { addNotification } from "@/store/slices/notificationSlice";
import {
    useGetKycStatusQuery,
    useGetFaceVerificationStatusQuery,
    useUploadIdCardMutation,
    useConfirmIdCardInfoMutation,
    useVerifyFaceMatchMutation,
    IdentityInfo,
} from "@/store/services/kycApi";
import IdCardInfo from "./id-card-info";

export default function VerifyPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    // RTK Query hooks
    const {
        data: kycStatus,
        isLoading: kycLoading,
        refetch: refetchKyc,
    } = useGetKycStatusQuery();
    const {
        data: faceStatus,
        isLoading: faceLoading,
        refetch: refetchFace,
    } = useGetFaceVerificationStatusQuery();
    const [uploadIdCard, { isLoading: isUploading }] =
        useUploadIdCardMutation();
    const [confirmIdCardInfo, { isLoading: isConfirming }] =
        useConfirmIdCardInfoMutation();
    const [verifyFaceMatch, { isLoading: isVerifying }] =
        useVerifyFaceMatchMutation();

    // Local state
    const [frontIdFile, setFrontIdFile] = useState<File | null>(null);
    const [backIdFile, setBackIdFile] = useState<File | null>(null);
    const [selfieFile, setSelfieFile] = useState<File | null>(null);
    const [showIdCardInfo, setShowIdCardInfo] = useState<boolean>(false);
    const [extractedIdInfo, setExtractedIdInfo] = useState<IdentityInfo | null>(
        null
    );

    // Loading state combined
    const loading =
        kycLoading || faceLoading || isUploading || isConfirming || isVerifying;

    const handleFrontIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFrontIdFile(e.target.files[0]);
        }
    };

    const handleBackIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBackIdFile(e.target.files[0]);
        }
    };

    const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelfieFile(e.target.files[0]);
        }
    };

    const handleIdCardSubmit = async (isFront: boolean) => {
        const file = isFront ? frontIdFile : backIdFile;

        if (!file) {
            dispatch(
                addNotification({
                    message: `Vui lòng chọn ảnh ${
                        isFront ? "mặt trước" : "mặt sau"
                    } CCCD`,
                    type: "error",
                    duration: 5000,
                })
            );
            return;
        }

        try {
            // Sử dụng RTK Query mutation
            await uploadIdCard({ file, isFront }).unwrap();

            // Thông báo thành công
            dispatch(
                addNotification({
                    message: `Tải lên ảnh ${
                        isFront ? "mặt trước" : "mặt sau"
                    } CCCD thành công!`,
                    type: "success",
                    duration: 3000,
                })
            );

            // Làm mới dữ liệu KYC
            const kycData = await refetchKyc();

            // Nếu đã tải lên cả mặt trước và mặt sau, hiển thị thông tin trích xuất
            if (kycData.data?.identity_info && !isFront) {
                setExtractedIdInfo(kycData.data.identity_info);
                setShowIdCardInfo(true);
            }

            // Reset file đã chọn
            if (isFront) {
                setFrontIdFile(null);
            } else {
                setBackIdFile(null);
            }
            // eslint-disable-next-line
        } catch (error: any) {
            console.error("Upload error:", error);
            dispatch(
                addNotification({
                    message:
                        error.data?.error ||
                        `Lỗi khi tải lên ảnh ${
                            isFront ? "mặt trước" : "mặt sau"
                        } CCCD`,
                    type: "error",
                    duration: 5000,
                })
            );
        }
    };

    const handleConfirmIdCardInfo = async (updatedInfo: IdentityInfo) => {
        try {
            // Sử dụng RTK Query mutation để xác nhận thông tin CCCD
            await confirmIdCardInfo(updatedInfo).unwrap();

            // Thông báo thành công
            dispatch(
                addNotification({
                    message: "Xác nhận thông tin CCCD thành công!",
                    type: "success",
                    duration: 3000,
                })
            );

            // Làm mới dữ liệu KYC
            refetchKyc();

            // Ẩn form xác nhận thông tin
            setShowIdCardInfo(false);
            // eslint-disable-next-line
        } catch (error: any) {
            console.error("Confirm ID card info error:", error);
            dispatch(
                addNotification({
                    message:
                        error.data?.error || "Lỗi khi xác nhận thông tin CCCD",
                    type: "error",
                    duration: 5000,
                })
            );
        }
    };

    const handleFaceVerification = async () => {
        if (!selfieFile) {
            dispatch(
                addNotification({
                    message: "Vui lòng chọn ảnh selfie",
                    type: "error",
                    duration: 5000,
                })
            );
            return;
        }

        try {
            // Sử dụng RTK Query mutation
            await verifyFaceMatch(selfieFile).unwrap();

            // Thông báo thành công
            dispatch(
                addNotification({
                    message: "Xác minh khuôn mặt thành công!",
                    type: "success",
                    duration: 3000,
                })
            );

            // Làm mới dữ liệu
            refetchKyc();
            refetchFace();

            // Reset file đã chọn
            setSelfieFile(null);
            // eslint-disable-next-line
        } catch (error: any) {
            console.error("Face verification error:", error);
            dispatch(
                addNotification({
                    message: error.data?.error || "Lỗi khi xác minh khuôn mặt",
                    type: "error",
                    duration: 5000,
                })
            );
        }
    };

    const isIDCardVerified = kycStatus?.id_card_verified;
    const isFaceVerified = faceStatus?.face_match;
    const isFullyVerified = kycStatus?.status === "verified";

    // Tự động chuyển hướng nếu đã xác minh
    useEffect(() => {
        if (isFullyVerified) {
            dispatch(
                addNotification({
                    message: "Bạn đã hoàn thành quá trình xác minh KYC!",
                    type: "success",
                    duration: 5000,
                })
            );

            // Chờ 2 giây trước khi chuyển hướng
            const timer = setTimeout(() => {
                router.push("/");
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isFullyVerified, router, dispatch]);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Xác minh danh tính KYC</h1>

            {loading && (
                <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
                    <p>Đang tải...</p>
                </div>
            )}

            {/* Hiển thị thông tin CCCD đã trích xuất để xác nhận */}
            {showIdCardInfo && extractedIdInfo && (
                <IdCardInfo
                    identityInfo={extractedIdInfo}
                    onConfirm={handleConfirmIdCardInfo}
                    onCancel={() => setShowIdCardInfo(false)}
                />
            )}

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">
                    Trạng thái xác minh
                </h2>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                    <span>Trạng thái KYC:</span>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isFullyVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                        {isFullyVerified ? "Đã xác minh" : "Chưa xác minh"}
                    </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                    <span>CCCD:</span>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isIDCardVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                        {isIDCardVerified ? "Đã xác minh" : "Chưa xác minh"}
                    </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span>Khuôn mặt:</span>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isFaceVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                        {isFaceVerified ? "Đã xác minh" : "Chưa xác minh"}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload CCCD mặt trước */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Tải lên CCCD mặt trước
                    </h2>
                    <div className="mb-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFrontIdUpload}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-orange-50 file:text-orange-700
                                hover:file:bg-orange-100"
                        />
                    </div>
                    {frontIdFile && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                Đã chọn: {frontIdFile.name}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={() => handleIdCardSubmit(true)}
                        disabled={!frontIdFile || loading}
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:bg-orange-300 w-full"
                    >
                        {loading ? "Đang xử lý..." : "Tải lên"}
                    </button>
                </div>

                {/* Upload CCCD mặt sau */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Tải lên CCCD mặt sau
                    </h2>
                    <div className="mb-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleBackIdUpload}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-orange-50 file:text-orange-700
                                hover:file:bg-orange-100"
                        />
                    </div>
                    {backIdFile && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                Đã chọn: {backIdFile.name}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={() => handleIdCardSubmit(false)}
                        disabled={!backIdFile || loading}
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:bg-orange-300 w-full"
                    >
                        {loading ? "Đang xử lý..." : "Tải lên"}
                    </button>
                </div>

                {/* Xác minh khuôn mặt */}
                <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">
                        Xác minh khuôn mặt
                    </h2>
                    <div className="mb-4">
                        <p className="text-gray-600 mb-4">
                            Tải lên ảnh selfie của bạn để xác minh danh tính.
                            Ảnh chụp cần rõ nét, đủ ánh sáng và thể hiện đầy đủ
                            khuôn mặt.
                        </p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleSelfieUpload}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-orange-50 file:text-orange-700
                                hover:file:bg-orange-100"
                        />
                    </div>
                    {selfieFile && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                Đã chọn: {selfieFile.name}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={handleFaceVerification}
                        disabled={!selfieFile || loading}
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:bg-orange-300 w-full"
                    >
                        {loading ? "Đang xử lý..." : "Xác minh khuôn mặt"}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-lg font-semibold mb-4">
                    Xác minh liveness
                </h2>
                <p className="text-gray-600 mb-4">
                    Để hoàn tất quá trình xác minh KYC, vui lòng thực hiện xác
                    minh liveness (chứng minh bạn là người thật). Bạn sẽ được
                    yêu cầu thực hiện một số hành động trước camera.
                </p>
                <Link
                    href="/verify/liveness"
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 inline-block w-full text-center"
                >
                    Tiếp tục xác minh liveness
                </Link>
            </div>
        </div>
    );
}
