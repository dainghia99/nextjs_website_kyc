/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLoginMutation } from "@/store/services/authApi";
import { useCheckAdminQuery } from "@/store/services/adminApi";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import { addNotification } from "@/store/slices/notificationSlice";

export default function AdminLogin() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState<string | null>(null);

    // RTK Query hooks
    const [login, { isLoading: isLoggingIn }] = useLoginMutation();
    const {
        data: adminData,
        isLoading: isCheckingAdmin,
        error: adminError,
    } = useCheckAdminQuery(undefined, { skip: !token });

    // Kiểm tra token trong localStorage và tự động kiểm tra quyền admin
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Xử lý chuyển hướng sau khi xác minh admin thành công
    useEffect(() => {
        if (adminData && adminData.is_admin) {
            // Cập nhật thông tin người dùng trong Redux store và localStorage
            const userStr = localStorage.getItem("user");
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    user.role = adminData.role;
                    localStorage.setItem("user", JSON.stringify(user));

                    // Cập nhật Redux store
                    dispatch(setUser(user));

                    // Thông báo thành công
                    dispatch(
                        addNotification({
                            message: "Đăng nhập quản trị thành công",
                            type: "success",
                            duration: 3000,
                        })
                    );

                    // Chuyển hướng đến dashboard
                    router.replace("/admin/dashboard");
                } catch (error) {
                    console.error("Error parsing user data:", error);
                }
            }
        }
    }, [adminData, router, dispatch]);

    // Xử lý lỗi từ checkAdmin
    useEffect(() => {
        if (adminError) {
            setError("Bạn không có quyền truy cập khu vực quản trị");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
        }
    }, [adminError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // Đăng nhập sử dụng RTK Query
            const result = await login({ email, password }).unwrap();

            // Lưu token vào localStorage và state
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            setToken(result.token);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Login error:", error);
            setError(error.data?.message || "Đăng nhập thất bại");

            // Xóa thông tin đăng nhập nếu lỗi
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="flex justify-center">
                        <Image
                            src="/Logo_DAI_NAM.png"
                            alt="Logo"
                            width={80}
                            height={80}
                            className="rounded-full"
                        />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Đăng nhập quản trị
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Vui lòng đăng nhập để truy cập khu vực quản trị
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                                disabled={isLoggingIn || isCheckingAdmin}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Mật khẩu"
                                disabled={isLoggingIn || isCheckingAdmin}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoggingIn || isCheckingAdmin}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
                        >
                            {isLoggingIn || isCheckingAdmin ? (
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                </span>
                            ) : (
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg
                                        className="h-5 w-5 text-orange-500 group-hover:text-orange-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            )}
                            {isLoggingIn || isCheckingAdmin
                                ? "Đang xử lý..."
                                : "Đăng nhập"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
