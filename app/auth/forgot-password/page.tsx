"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Xử lý quên mật khẩu ở đây
        router.push("/auth/sign-in");
    };

    return (
        <div className="flex flex-col items-center p-6 w-full">
            <Image
                src="/Logo_DAI_NAM.png"
                alt="Logo"
                width={200}
                height={200}
                className="mt-8 mb-8"
            />
            <h1 className="text-2xl font-bold text-orange-500 mb-2">
                Quên mật khẩu
            </h1>
            <p className="text-gray-600 text-center mb-8">
                Vui lòng nhập email để lấy lại mật khẩu
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        required
                        className="mt-1 block w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
                >
                    Gửi yêu cầu
                </button>

                <div className="text-center">
                    <Link
                        href="/auth/sign-in"
                        className="text-orange-500 hover:text-orange-600"
                    >
                        Quay lại đăng nhập
                    </Link>
                </div>
            </form>
        </div>
    );
}
