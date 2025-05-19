/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLoginMutation } from "@/store/services/authApi";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import { addNotification } from "@/store/slices/notificationSlice";

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Sử dụng hook từ RTK Query
    const [login, { isLoading, isSuccess, data, error: loginError }] =
        useLoginMutation();
    const dispatch = useAppDispatch();

    // Xử lý submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            // Sử dụng RTK Query mutation thay vì gọi trực tiếp API
            await login({ email, password }).unwrap();

            // eslint-disable-next-line
        } catch (err: any) {
            const errorMessage = err.data?.message || "Đăng nhập thất bại";
            setError(errorMessage);

            // Hiển thị thông báo lỗi
            dispatch(
                addNotification({
                    message: errorMessage,
                    type: "error",
                    duration: 5000,
                })
            );
        }
    };

    // Xử lý kết quả đăng nhập thành công
    useEffect(() => {
        if (isSuccess && data?.token && data?.user) {
            // Lưu token và user vào localStorage như trước
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Dispatch action để cập nhật user trong Redux store
            dispatch(
                setUser({
                    ...data.user,
                    isLoggedIn: true,
                })
            );

            // Hiển thị thông báo thành công
            dispatch(
                addNotification({
                    message: "Đăng nhập thành công!",
                    type: "success",
                    duration: 3000,
                })
            );

            router.push("/");
        }
    }, [isSuccess, data, dispatch, router]);

    // Xử lý lỗi từ RTK Query
    useEffect(() => {
        if (loginError) {
            if ("data" in loginError) {
                const errorMessage =
                    // eslint-disable-next-line
                    (loginError.data as any)?.message || "Đăng nhập thất bại";
                setError(errorMessage);

                // Hiển thị thông báo lỗi
                dispatch(
                    addNotification({
                        message: errorMessage,
                        type: "error",
                        duration: 5000,
                    })
                );
            } else {
                const errorMessage = "Lỗi kết nối đến server";
                setError(errorMessage);

                // Hiển thị thông báo lỗi
                dispatch(
                    addNotification({
                        message: errorMessage,
                        type: "error",
                        duration: 5000,
                    })
                );
            }
        }
    }, [loginError, dispatch]);

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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md"
                        disabled={isLoading}
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Link
                    href="/auth/forgot-password"
                    className="block text-right text-sm text-orange-500 hover:text-orange-600"
                >
                    Quên mật khẩu?
                </Link>

                <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 disabled:bg-orange-300"
                    disabled={isLoading}
                >
                    {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                </button>

                <div className="text-center">
                    <span className="text-gray-600">
                        Bạn chưa có tài khoản?{" "}
                    </span>
                    <Link
                        href="/auth/sign-up"
                        className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                        Đăng ký ngay
                    </Link>
                </div>
            </form>
        </div>
    );
}
