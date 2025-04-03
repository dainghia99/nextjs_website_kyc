"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
    router.push("/home");
  };

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
            className="mt-1 block w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <input
            type="password"
            required
            className="mt-1 block w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md"
          />
        </div>

        <Link
          href="/auth/forgot-password"
          className="block text-right text-sm text-orange-500 hover:text-orange-600"
        >
          Quên mật khẩu?
        </Link>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
        >
          Đăng nhập
        </button>

        <div className="text-center">
          <span className="text-gray-600">Bạn chưa có tài khoản? </span>
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
