"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login } from "@/services/auth";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (token && userStr) {
            try {
                // Gọi API để kiểm tra quyền admin
                const checkAdmin = async () => {
                    try {
                        const response = await fetch(
                            "http://localhost:5000/admin/check-admin",
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (response.ok) {
                            const data = await response.json();
                            if (data.is_admin) {
                                // Cập nhật thông tin user trong localStorage
                                const user = JSON.parse(userStr);
                                user.role = data.role;
                                localStorage.setItem(
                                    "user",
                                    JSON.stringify(user)
                                );

                                router.replace("/admin/dashboard");
                            }
                        }
                    } catch (error) {
                        console.error("Error checking admin status:", error);
                    }
                };

                checkAdmin();
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Đăng nhập bình thường
            const response = await login({ email, password });

            // Lưu thông tin đăng nhập
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));

            // Kiểm tra quyền admin
            try {
                const adminCheck = await fetch(
                    "http://localhost:5000/admin/check-admin",
                    {
                        headers: {
                            Authorization: `Bearer ${response.token}`,
                        },
                    }
                );

                if (!adminCheck.ok) {
                    throw new Error("Không có quyền truy cập");
                }

                const adminData = await adminCheck.json();

                if (!adminData.is_admin) {
                    setError("Bạn không có quyền truy cập khu vực quản trị");
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    return;
                }

                // Cập nhật role trong thông tin người dùng
                const user = response.user;
                user.role = adminData.role;
                localStorage.setItem("user", JSON.stringify(user));

                // Chuyển hướng đến dashboard
                router.push("/admin/dashboard");
            } catch (adminErr) {
                console.error("Error checking admin status:", adminErr);
                setError("Bạn không có quyền truy cập khu vực quản trị");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Đăng nhập thất bại");
        } finally {
            setLoading(false);
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
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
                        >
                            {loading ? (
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
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
