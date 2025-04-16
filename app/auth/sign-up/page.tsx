"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/services/auth";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }
    try {
      await register(formData);
      router.push("/auth/sign-in");
    } catch (err: any) {
      setError(err.response?.data?.error || "Đăng ký thất bại");
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
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
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
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
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
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="mt-1 block w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

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
