"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Camera from "@/app/components/camera";
import { verifyLiveness } from "@/services/kyc";

export default function LivenessVerificationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
    const [verificationResult, setVerificationResult] = useState<any>(null);
    const [showCamera, setShowCamera] = useState(true);

    // Kiểm tra xem người dùng đã đăng nhập chưa
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/auth/sign-in");
        }
    }, [router]);

    const handleCapture = (blob: Blob) => {
        setVideoBlob(blob);
        setShowCamera(false);
    };

    const handleCameraError = (errorMessage: string) => {
        setError(errorMessage);
    };

    const handleRetry = () => {
        setVideoBlob(null);
        setError("");
        setSuccess("");
        setVerificationResult(null);
        setShowCamera(true);
    };

    const handleSubmit = async () => {
        if (!videoBlob) {
            setError("Vui lòng ghi hình video trước khi gửi");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Tạo FormData để gửi video
            const formData = new FormData();
            formData.append("video", videoBlob, "liveness.webm");

            // Gọi API xác minh liveness
            const result = await verifyLiveness(formData);

            setVerificationResult(result);

            if (result.status === "verified" || result.liveness_score > 0.7) {
                setSuccess(
                    `Xác minh thành công! Điểm số: ${result.liveness_score.toFixed(
                        2
                    )}, Số lần nháy mắt: ${result.blink_count}`
                );

                // Cập nhật trạng thái người dùng trong localStorage
                const userStr = localStorage.getItem("user");
                if (userStr) {
                    const userData = JSON.parse(userStr);
                    userData.kyc_status = "verified";
                    localStorage.setItem("user", JSON.stringify(userData));
                }

                // Chuyển hướng về trang chủ sau 3 giây
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            } else {
                // Tạo thông báo lỗi chi tiết hơn dựa trên kết quả
                let errorMessage = "";

                if (result.blink_count === 0) {
                    errorMessage = `Xác minh không thành công: Không phát hiện được nháy mắt. Vui lòng thử lại và đảm bảo nháy mắt rõ ràng ít nhất 3 lần.`;
                } else if (result.blink_count < 3) {
                    errorMessage = `Xác minh không thành công: Chỉ phát hiện được ${result.blink_count} lần nháy mắt (yêu cầu ít nhất 3 lần). Vui lòng thử lại.`;
                } else if (result.liveness_score <= 0.7) {
                    errorMessage = `Xác minh không thành công: Điểm số liveness (${result.liveness_score.toFixed(
                        2
                    )}) không đạt yêu cầu. Vui lòng thử lại trong môi trường có ánh sáng tốt hơn.`;
                } else {
                    errorMessage = `Xác minh không thành công. Điểm số: ${result.liveness_score.toFixed(
                        2
                    )}, Số lần nháy mắt: ${
                        result.blink_count
                    }. Vui lòng thử lại.`;
                }

                setError(errorMessage);
            }
        } catch (error: any) {
            console.error("Lỗi xác minh:", error);
            setError(
                error.response?.data?.error ||
                    "Không thể xác minh. Vui lòng thử lại sau."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    href="/verify"
                    className="text-orange-500 hover:text-orange-600"
                >
                    ← Quay lại trang xác minh
                </Link>
            </div>

            <h1 className="text-2xl font-bold mb-6">Xác minh thực thể sống</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Hướng dẫn</h2>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>Đảm bảo khuôn mặt của bạn nằm trong khung hình</li>
                    <li>Ánh sáng đầy đủ để camera có thể nhìn rõ khuôn mặt</li>
                    <li>
                        <strong>Nháy mắt ít nhất 3 lần</strong> trong quá trình
                        ghi hình (nhắm hoàn toàn cả hai mắt rồi mở lại)
                    </li>
                    <li>
                        Nháy mắt <strong>chậm và rõ ràng</strong> để hệ thống có
                        thể phát hiện
                    </li>
                    <li>Giữ nguyên vị trí và không di chuyển quá nhanh</li>
                    <li>Quá trình ghi hình sẽ kéo dài 5 giây</li>
                </ul>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                {loading && (
                    <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
                        <p>Đang xử lý video...</p>
                    </div>
                )}

                {showCamera && !loading && (
                    <Camera
                        onCapture={handleCapture}
                        onError={handleCameraError}
                        recordingTime={5}
                    />
                )}

                {videoBlob && !showCamera && !loading && (
                    <div className="mt-4">
                        <h3 className="font-medium mb-2">Video đã ghi:</h3>
                        <video
                            src={URL.createObjectURL(videoBlob)}
                            controls
                            className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                        />

                        <div className="mt-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                            <p className="font-medium">Lưu ý quan trọng:</p>
                            <p>
                                Để xác minh thành công, hệ thống cần phát hiện
                                ít nhất 3 lần nháy mắt trong video. Vui lòng
                                kiểm tra video của bạn trước khi gửi.
                            </p>
                        </div>

                        <div className="flex justify-center mt-4 space-x-4">
                            <button
                                onClick={handleRetry}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Ghi lại
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Gửi để xác minh
                            </button>
                        </div>
                    </div>
                )}

                {verificationResult && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-2">Kết quả xác minh:</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Điểm số liveness:
                                </p>
                                <p className="font-medium">
                                    {verificationResult.liveness_score?.toFixed(
                                        2
                                    ) || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Số lần nháy mắt:
                                </p>
                                <p className="font-medium">
                                    {verificationResult.blink_count || "0"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Trạng thái:
                                </p>
                                <p
                                    className={`font-medium ${
                                        verificationResult.status === "verified"
                                            ? "text-green-600"
                                            : "text-yellow-600"
                                    }`}
                                >
                                    {verificationResult.status === "verified"
                                        ? "Đã xác minh"
                                        : "Chưa xác minh"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Số lần thử:
                                </p>
                                <p className="font-medium">
                                    {verificationResult.attempt_count || "1"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
