"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HomeIcon,
    DocumentCheckIcon,
    DocumentTextIcon,
    UserIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
    const pathname = usePathname();

    const links = [
        {
            href: "/",
            label: "Trang chủ",
            icon: HomeIcon,
        },
        {
            href: "/verify",
            label: "Xác thực",
            icon: DocumentCheckIcon,
        },
        {
            href: "/history",
            label: "Lịch sử",
            icon: DocumentTextIcon,
        },
        {
            href: "/profile",
            label: "Hồ sơ",
            icon: UserIcon,
        },
    ];

    return (
        <header className="bg-white top-0 z-50 shadow-sm">
            <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Image
                            src="/Logo_DAI_NAM.png"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <h1 className="ml-3 font-bold text-xl text-gray-800">
                            HỆ THỐNG XÁC THỰC KYC
                        </h1>
                    </div>

                    <nav className="hidden sm:flex space-x-8">
                        {links.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
									${
                                        pathname === href
                                            ? "text-orange-600 bg-orange-50"
                                            : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                                    }`}
                            >
                                <Icon className="h-5 w-5 mr-1.5" />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
                <div className="flex justify-around">
                    {links.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors
								${
                                    pathname === href
                                        ? "text-orange-600"
                                        : "text-gray-600 hover:text-orange-600"
                                }`}
                        >
                            <Icon className="h-6 w-6 mb-1" />
                            <span>{label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    );
}
