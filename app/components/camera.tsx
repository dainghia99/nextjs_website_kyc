/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import { useRef, useState, useEffect } from "react";

interface CameraProps {
    onCapture: (videoBlob: Blob) => void;
    onError: (error: string) => void;
    recordingTime?: number; // Thời gian ghi hình tính bằng giây
}

export default function Camera({
    onCapture,
    onError,
    recordingTime = 5,
}: CameraProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const [isRecording, setIsRecording] = useState(false);
    const [countdown, setCountdown] = useState(recordingTime);
    const [cameraReady, setCameraReady] = useState(false);

    // Khởi tạo camera
    useEffect(() => {
        async function setupCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                streamRef.current = stream;
                setCameraReady(true);
            } catch (err) {
                console.error("Lỗi khi truy cập camera:", err);
                onError(
                    "Không thể truy cập camera. Vui lòng đảm bảo bạn đã cấp quyền truy cập camera cho trang web này."
                );
            }
        }

        setupCamera();

        // Dọn dẹp khi component unmount
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, [onError]);

    // Xử lý ghi hình
    const startRecording = () => {
        if (!streamRef.current) {
            onError("Camera chưa sẵn sàng");
            return;
        }

        chunksRef.current = [];
        const options = { mimeType: "video/webm;codecs=vp9,opus" };

        try {
            mediaRecorderRef.current = new MediaRecorder(
                streamRef.current,
                options
            );
        } catch (e) {
            try {
                // Thử lại với định dạng khác nếu trình duyệt không hỗ trợ
                mediaRecorderRef.current = new MediaRecorder(
                    streamRef.current,
                    { mimeType: "video/webm" }
                );
                console.log(e);
            } catch (e) {
                onError(
                    "Trình duyệt của bạn không hỗ trợ ghi hình. Vui lòng thử trình duyệt khác."
                );
                console.log(e);
                return;
            }
        }

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                chunksRef.current.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            const videoBlob = new Blob(chunksRef.current, {
                type: "video/webm",
            });
            onCapture(videoBlob);
        };

        // Bắt đầu ghi hình
        mediaRecorderRef.current.start();
        setIsRecording(true);
        setCountdown(recordingTime);

        // Đếm ngược và dừng ghi hình sau khi hết thời gian
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    stopRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="relative w-full max-w-md mx-auto">
            <div className="relative overflow-hidden rounded-lg shadow-lg aspect-video bg-gray-900">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                />

                {isRecording && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center">
                        <span className="animate-pulse mr-2 h-3 w-3 bg-white rounded-full inline-block"></span>
                        <span>Đang ghi: {countdown}s</span>
                    </div>
                )}

                {/* Hướng dẫn nháy mắt */}
                {isRecording && (
                    <div className="absolute bottom-4 left-0 right-0 text-center bg-black bg-opacity-70 text-white p-2 font-medium">
                        Vui lòng nháy mắt ít nhất 3 lần trong quá trình ghi hình
                        <br />
                        <span className="text-sm">
                            (Nhắm hoàn toàn cả hai mắt rồi mở lại)
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-4 flex justify-center">
                {!isRecording && cameraReady && (
                    <button
                        onClick={startRecording}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Bắt đầu ghi hình
                    </button>
                )}
                {isRecording && (
                    <button
                        onClick={stopRecording}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Dừng ghi hình
                    </button>
                )}
            </div>
        </div>
    );
}
