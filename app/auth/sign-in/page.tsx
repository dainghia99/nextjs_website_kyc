"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/services/auth";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Đăng nhập thất bại");
    }
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md"
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
