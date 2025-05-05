"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    getKYCStatus,
    getFaceVerificationStatus,
    uploadIDCard,
    verifyFaceMatch,
} from "@/services/kyc";

export default function VerifyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [kycStatus, setKycStatus] = useState<any>(null);
    const [faceStatus, setFaceStatus] = useState<any>(null);
    const [frontIdFile, setFrontIdFile] = useState<File | null>(null);
    const [backIdFile, setBackIdFile] = useState<File | null>(null);
    const [selfieFile, setSelfieFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadKYCStatus();
    }, []);

    const loadKYCStatus = async () => {
        setLoading(true);
        try {
            // Tải trạng thái KYC
            const status = await getKYCStatus();
            console.log("KYC Status:", status);
            setKycStatus(status);

            // Tải trạng thái xác minh khuôn mặt
            const faceVerificationStatus = await getFaceVerificationStatus();
            console.log("Face Verification Status:", faceVerificationStatus);
            setFaceStatus(faceVerificationStatus);
        } catch (error) {
            console.error("Error loading KYC status:", error);
            setKycStatus({
                liveness_verified: false,
                id_card_verified: false,
            });
            setFaceStatus({
                face_verified: false,
                face_match: false,
                selfie_uploaded: false,
            });
        } finally {
            setLoading(false);
        }
    };

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
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const file = isFront ? frontIdFile : backIdFile;
            if (!file) {
                setError(
                    `Vui lòng chọn ảnh ${
                        isFront ? "mặt trước" : "mặt sau"
                    } CCCD`
                );
                return;
            }

            const result = await uploadIDCard(file, isFront);
            setSuccess(
                `Tải lên ảnh ${
                    isFront ? "mặt trước" : "mặt sau"
                } CCCD thành công!`
            );
            await loadKYCStatus(); // Tải lại trạng thái
        } catch (error: any) {
            console.error("Upload error:", error);
            setError(
                error.response?.data?.error ||
                    `Lỗi khi tải lên ảnh ${
                        isFront ? "mặt trước" : "mặt sau"
                    } CCCD`
            );
        } finally {
            setLoading(false);
        }
    };

    const handleFaceVerification = async () => {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            if (!selfieFile) {
                setError("Vui lòng chọn ảnh selfie");
                return;
            }

            const result = await verifyFaceMatch(selfieFile);
            setSuccess("Xác minh khuôn mặt thành công!");
            await loadKYCStatus(); // Tải lại trạng thái
        } catch (error: any) {
            console.error("Face verification error:", error);
            setError(
                error.response?.data?.error || "Lỗi khi xác minh khuôn mặt"
            );
        } finally {
            setLoading(false);
        }
    };

    const isIDCardVerified = kycStatus?.id_card_verified;
    const isFaceVerified = faceStatus?.face_match;
    const isFullyVerified = kycStatus?.status === "verified";

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Xác minh danh tính KYC</h1>

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

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
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
                            <p className="text-sm text-gray-600 mb-2">
                                Đã chọn: {frontIdFile.name}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={() => handleIdCardSubmit(true)}
                        disabled={!frontIdFile || loading}
                        className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Tải lên mặt trước
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
                            <p className="text-sm text-gray-600 mb-2">
                                Đã chọn: {backIdFile.name}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={() => handleIdCardSubmit(false)}
                        disabled={!backIdFile || loading}
                        className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Tải lên mặt sau
                    </button>
                </div>
            </div>

            {/* Xác minh thực thể sống */}
            <div className="flex flex-col md:flex-row gap-4 mt-4">
                <Link
                    href="/verify/liveness"
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 text-center"
                >
                    Xác minh thực thể sống
                </Link>
            </div>

            {/* Xác minh khuôn mặt */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-lg font-semibold mb-4">
                    Xác minh khuôn mặt
                </h2>
                <p className="text-gray-600 mb-4">
                    Tải lên ảnh selfie của bạn để xác minh khuôn mặt với ảnh
                    trên CCCD
                </p>
                <div className="mb-4">
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
                        <p className="text-sm text-gray-600 mb-2">
                            Đã chọn: {selfieFile.name}
                        </p>
                    </div>
                )}

                <button
                    onClick={handleFaceVerification}
                    disabled={!selfieFile || loading || !isIDCardVerified}
                    className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Xác minh khuôn mặt
                </button>
                {!isIDCardVerified && (
                    <p className="text-sm text-red-500 mt-2">
                        Bạn cần tải lên CCCD trước khi xác minh khuôn mặt
                    </p>
                )}
            </div>
        </div>
    );
}
