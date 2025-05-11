// d:\do_an_tot_nghiep\thuc_hanh\frontend\website\app\layout.tsx
import "./globals.css";
import Header from "./components/header";
import StoreProvider from "./StoreProvider";
import Notifications from "./components/Notifications";

export const metadata = {
  title: "Hệ thống xác thực KYC",
  description: "Hệ thống xác thực danh tính khách hàng KYC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <StoreProvider>
          <Header />
          <Notifications />
          <main className="container mx-auto px-4 py-6">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
