"use client";
import { mockUser } from "@/constants/mock-data";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();

  const handleLogout = () => {
    // Add logout logic here
    router.replace("/auth/sign-in");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/Logo_DAI_NAM.png"
              alt="Avatar"
              width={100}
              height={100}
              className="rounded-full bg-white border-4 border-orange-500"
            />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {mockUser.name}
              </h2>
              <p className="text-gray-600">{mockUser.email}</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Họ và tên</span>
              <span className="font-medium text-gray-800">{mockUser.name}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-gray-800">
                {mockUser.email}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
