import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 18000000, // 30 giây timeout
});

// Request interceptor - thêm token vào header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - xử lý lỗi 401 (Unauthorized) và ghi log lỗi
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Ghi log lỗi vào console thay vì hiển thị trên giao diện
        console.error("Axios error:", error);

        // Ghi log thêm thông tin chi tiết về lỗi nếu có
        if (error.response) {
            // Lỗi từ phản hồi của server
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);

            // Xử lý lỗi 401 (Unauthorized)
            if (error.response.status === 401) {
                // Token hết hạn hoặc không hợp lệ
                console.log("Token expired or invalid, clearing auth data");

                // Xóa dữ liệu đăng nhập
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                // Chuyển hướng đến trang đăng nhập
                window.location.href = "/auth/sign-in";
            }
        } else if (error.request) {
            // Yêu cầu đã được gửi nhưng không nhận được phản hồi
            console.error("Error request:", error.request);
        } else {
            // Lỗi khi thiết lập yêu cầu
            console.error("Error message:", error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
