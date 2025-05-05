import api from "./api";

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData extends LoginData {
    confirmPassword: string;
}

export const login = async (data: LoginData) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

export const register = async (data: RegisterData) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

export const logout = async () => {
    try {
        const response = await api.post("/auth/logout");
        // Xóa dữ liệu đăng nhập khỏi localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return response.data;
    } catch (error) {
        console.error("Logout error:", error);
        // Vẫn xóa dữ liệu đăng nhập khỏi localStorage ngay cả khi API gặp lỗi
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        throw error;
    }
};

export const forgotPassword = async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
};
