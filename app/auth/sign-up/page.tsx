"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đăng ký ở đây
    router.push("/auth/sign-in");
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
            className="mt-1 block w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <input
            type="password"
            required
            className="mt-1 block w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nhập lại mật khẩu
          </label>
          <input
            type="password"
            required
            className="mt-1 block w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
        >
          Đăng ký
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
