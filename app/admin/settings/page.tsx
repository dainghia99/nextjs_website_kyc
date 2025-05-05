"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Hệ thống xác thực KYC",
    adminEmail: "admin@example.com",
    maxFileSize: 16,
    maxVideoLength: 10,
  });

  const [kycSettings, setKycSettings] = useState({
    minBlinkCount: 3,
    livenessThreshold: 0.7,
    faceMatchThreshold: 0.6,
    maxAttempts: 3,
    cooldownPeriod: 30,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    adminNotifications: true,
    userNotifications: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleKYCSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setKycSettings({
      ...kycSettings,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      // Trong thực tế, bạn sẽ gọi API để lưu cài đặt
      // await api.post('/admin/settings', { generalSettings, kycSettings, notificationSettings });
      
      // Giả lập thời gian xử lý
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess("Cài đặt đã được lưu thành công");
    } catch (err) {
      setError("Không thể lưu cài đặt. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Cài đặt hệ thống</h1>
      
      {success && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSaveSettings}>
        {/* Cài đặt chung */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Cài đặt chung</h2>
          <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                Tên hệ thống
              </label>
              <input
                type="text"
                name="siteName"
                id="siteName"
                value={generalSettings.siteName}
                onChange={handleGeneralSettingsChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                Email quản trị viên
              </label>
              <input
                type="email"
                name="adminEmail"
                id="adminEmail"
                value={generalSettings.adminEmail}
                onChange={handleGeneralSettingsChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="maxFileSize" className="block text-sm font-medium text-gray-700">
                Kích thước file tối đa (MB)
              </label>
              <input
                type="number"
                name="maxFileSize"
                id="maxFileSize"
                min="1"
                max="50"
                value={generalSettings.maxFileSize}
                onChange={handleGeneralSettingsChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="maxVideoLength" className="block text-sm font-medium text-gray-700">
                Thời lượng video tối đa (giây)
              </label>
              <input
                type="number"
                name="maxVideoLength"
                id="maxVideoLength"
                min="5"
                max="30"
                value={generalSettings.maxVideoLength}
                onChange={handleGeneralSettingsChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Cài đặt KYC */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Cài đặt KYC</h2>
          <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
              <label htmlFor="minBlinkCount" className="block text-sm font-medium text-gray-700">
                Số lần nháy mắt tối thiểu
              </label>
              <input
                type="number"
                name="minBlinkCount"
                id="minBlinkCount"
                min="1"
                max="10"
                value={kycSettings.minBlinkCount}
                onChange={handleKYCSettingsChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="livenessThreshold" className="block text-sm font-medium text-gray-700">
                Ngưỡng xác minh thực thể sống (0-1)
              </label>
              <input
                type="number"
                name="livenessThreshold"
                id="livenessThreshold"
                min="0"
                max="1"
                step="0.1"
                value={kycSettings.livenessThreshold}
                onChange={handleKYCSettingsChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="faceMatchThreshold" className="block text-sm font-medium text-gray-700">
                Ngưỡng so khớp khuôn mặt (0-1)
              </label>
              <input
                type="number"
                name="faceMatchThreshold"
                id="faceMatchThreshold"
                min="0"
                max="1"
                step="0.1"
                value={kycSettings.faceMatchThreshold}
                onChange={handleKYCSettingsChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="maxAttempts" className="block text-sm font-medium text-gray-700">
                Số lần thử tối đa
              </label>
              <input
                type="number"
                name="maxAttempts"
                id="maxAttempts"
                min="1"
                max="10"
                value={kycSettings.maxAttempts}
                onChange={handleKYCSettingsChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="cooldownPeriod" className="block text-sm font-medium text-gray-700">
                Thời gian chờ giữa các lần thử (phút)
              </label>
              <input
                type="number"
                name="cooldownPeriod"
                id="cooldownPeriod"
                min="1"
                max="60"
                value={kycSettings.cooldownPeriod}
                onChange={handleKYCSettingsChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Cài đặt thông báo */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Cài đặt thông báo</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="emailNotifications"
                  name="emailNotifications"
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationSettingsChange}
                  className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                  Gửi thông báo qua email
                </label>
                <p className="text-gray-500">Gửi email thông báo khi có yêu cầu KYC mới hoặc khi trạng thái KYC thay đổi.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="adminNotifications"
                  name="adminNotifications"
                  type="checkbox"
                  checked={notificationSettings.adminNotifications}
                  onChange={handleNotificationSettingsChange}
                  className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="adminNotifications" className="font-medium text-gray-700">
                  Thông báo cho quản trị viên
                </label>
                <p className="text-gray-500">Gửi thông báo cho quản trị viên khi có yêu cầu KYC mới.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="userNotifications"
                  name="userNotifications"
                  type="checkbox"
                  checked={notificationSettings.userNotifications}
                  onChange={handleNotificationSettingsChange}
                  className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="userNotifications" className="font-medium text-gray-700">
                  Thông báo cho người dùng
                </label>
                <p className="text-gray-500">Gửi thông báo cho người dùng khi trạng thái KYC của họ thay đổi.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Nút lưu */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
          >
            {loading ? "Đang lưu..." : "Lưu cài đặt"}
          </button>
        </div>
      </form>
    </div>
  );
}
