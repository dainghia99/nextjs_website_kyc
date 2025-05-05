import api from "./api";

export const checkAdminStatus = async () => {
    const response = await api.get("/admin/check-admin");
    return response.data;
};

export const getUsers = async (page = 1, perPage = 10, search = "") => {
    const response = await api.get("/admin/users", {
        params: { page, per_page: perPage, search }
    });
    return response.data;
};

export const getUserDetails = async (userId: number) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
};

export const updateUserRole = async (userId: number, role: string) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
};

export const getKYCRequests = async (page = 1, perPage = 10, status = "") => {
    const response = await api.get("/admin/kyc-requests", {
        params: { page, per_page: perPage, status }
    });
    return response.data;
};

export const approveKYC = async (kycId: number) => {
    const response = await api.post(`/admin/kyc-requests/${kycId}/approve`);
    return response.data;
};

export const rejectKYC = async (kycId: number, reason: string) => {
    const response = await api.post(`/admin/kyc-requests/${kycId}/reject`, { reason });
    return response.data;
};

export const getStatistics = async () => {
    const response = await api.get("/admin/statistics");
    return response.data;
};
