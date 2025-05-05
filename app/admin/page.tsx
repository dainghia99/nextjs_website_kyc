"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Chuyển hướng đến trang dashboard
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-2"></div>
        <p>Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
