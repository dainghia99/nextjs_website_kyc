"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    UserGroupIcon,
    HomeIcon,
    IdentificationIcon,
    ArrowLeftOnRectangleIcon,
    Cog6ToothIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";
import { logout } from "@/services/auth";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Kiểm tra xem người dùng có phải là admin không
        const checkAdmin = async () => {
            try {
                const token = localStorage.getItem("token");
                const userStr = localStorage.getItem("user");

                if (!token || !userStr) {
                    router.replace("/admin/login");
                    return;
                }

                // Gọi API để kiểm tra quyền admin
                const response = await fetch(
                    "http://localhost:5000/admin/check-admin",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Không có quyền truy cập");
                }

                const data = await response.json();

                if (data.is_admin) {
                    setIsAdmin(true);

                    // Cập nhật thông tin user trong localStorage
                    const user = JSON.parse(userStr);
                    user.role = data.role;
                    localStorage.setItem("user", JSON.stringify(user));
                } else {
                    // Nếu không phải admin, chuyển hướng về trang đăng nhập admin
                    router.replace("/admin/login");
                }
            } catch (error) {
                console.error("Error checking admin status:", error);
                router.replace("/admin/login");
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [router]);

    const handleLogout = async () => {
        try {
            await logout();
            router.replace("/admin/login");
        } catch (error) {
            console.error("Logout error:", error);
            router.replace("/admin/login");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return null; // Sẽ chuyển hướng trong useEffect
    }

    const navigation = [
        {
            name: "Dashboard",
            href: "/admin/dashboard",
            icon: HomeIcon,
        },
        {
            name: "Quản lý người dùng",
            href: "/admin/users",
            icon: UserGroupIcon,
        },
        {
            name: "Quản lý KYC",
            href: "/admin/kyc",
            icon: IdentificationIcon,
        },
        {
            name: "Thống kê",
            href: "/admin/statistics",
            icon: ChartBarIcon,
        },
        {
            name: "Cài đặt",
            href: "/admin/settings",
            icon: Cog6ToothIcon,
        },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
                        <div className="flex items-center flex-shrink-0 px-4 mb-5">
                            <Image
                                src="/Logo_DAI_NAM.png"
                                alt="Logo"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <h1 className="ml-3 text-xl font-semibold text-gray-800">
                                KYC Admin
                            </h1>
                        </div>
                        <div className="flex flex-col flex-grow">
                            <nav className="flex-1 px-2 space-y-1 bg-white">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`${
                                            pathname === item.href
                                                ? "bg-orange-50 text-orange-600"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                    >
                                        <item.icon
                                            className={`${
                                                pathname === item.href
                                                    ? "text-orange-500"
                                                    : "text-gray-400 group-hover:text-gray-500"
                                            } mr-3 flex-shrink-0 h-6 w-6`}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 p-4 border-t">
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-sm font-medium text-gray-500 rounded-md hover:text-gray-700 group"
                            >
                                <ArrowLeftOnRectangleIcon
                                    className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                />
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-white border-t">
                <div className="flex justify-around">
                    {navigation.slice(0, 4).map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`${
                                pathname === item.href
                                    ? "text-orange-600"
                                    : "text-gray-600 hover:text-gray-900"
                            } flex flex-col items-center py-2 px-3`}
                        >
                            <item.icon
                                className={`${
                                    pathname === item.href
                                        ? "text-orange-500"
                                        : "text-gray-400"
                                } h-6 w-6`}
                                aria-hidden="true"
                            />
                            <span className="text-xs mt-1">{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
