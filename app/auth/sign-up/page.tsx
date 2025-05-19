/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useRegisterMutation } from "@/store/services/authApi";
import { useAppDispatch } from "@/store/hooks";
import { addNotification } from "@/store/slices/notificationSlice";

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    // Sử dụng RTK Query mutation hook
    const [register, { isLoading, isSuccess, error: registerError }] =
        useRegisterMutation();
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu nhập lại không khớp");
            dispatch(
                addNotification({
                    message: "Mật khẩu nhập lại không khớp",
                    type: "error",
                    duration: 5000,
                })
            );
            return;
        }

        try {
            // Sử dụng RTK Query mutation
            await register({
                email: formData.email,
                password: formData.password,
            }).unwrap();

            // Thông báo thành công
            dispatch(
                addNotification({
                    message: "Đăng ký thành công! Vui lòng đăng nhập.",
                    type: "success",
                    duration: 3000,
                })
            );
            // eslint-disable-next-line
        } catch (err: any) {
            const errorMessage = err.data?.message || "Đăng ký thất bại";
            setError(errorMessage);
            dispatch(
                addNotification({
                    message: errorMessage,
                    type: "error",
                    duration: 5000,
                })
            );
        }
    };

    // Xử lý chuyển hướng sau khi đăng ký thành công
    useEffect(() => {
        if (isSuccess) {
            router.push("/auth/sign-in");
        }
    }, [isSuccess, router]);

    // Xử lý lỗi RTK Query
    useEffect(() => {
        if (registerError) {
            if ("data" in registerError) {
                const errorMessage =
                    // eslint-disable-next-line
                    (registerError.data as any)?.message || "Đăng ký thất bại";
                setError(errorMessage);
            } else {
                setError("Lỗi kết nối đến máy chủ");
            }
        }
    }, [registerError]);

    return (
        <div className="flex flex-col items-center p-6">
            <Image
                src="/Logo_DAI_NAM.png"
                alt="Logo"
                width={200}
                height={200}
                className="mt-8 mb-8"
            />

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        className="mt-1 block w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                        className="mt-1 block w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Nhập lại mật khẩu
                    </label>
                    <input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                confirmPassword: e.target.value,
                            })
                        }
                        className="mt-1 block w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md"
                        disabled={isLoading}
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 disabled:bg-orange-300"
                    disabled={isLoading}
                >
                    {isLoading ? "Đang xử lý..." : "Đăng ký"}
                </button>

                <div className="text-center">
                    <span className="text-gray-600">Đã có tài khoản? </span>
                    <Link
                        href="/auth/sign-in"
                        className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                        Đăng nhập ngay
                    </Link>
                </div>
            </form>
        </div>
    );
}
