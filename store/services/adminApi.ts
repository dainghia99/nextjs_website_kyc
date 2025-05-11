import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Định nghĩa API base URL từ biến môi trường hoặc hardcode
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Định nghĩa interface AdminUser
export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  is_admin: boolean;
}

// Định nghĩa interface User cho quản lý user
export interface User {
  id: number;
  email: string;
  full_name: string;
  verified_at: string | null;
  status: string;
  role?: string;
}

// Định nghĩa interface KYCRequest
export interface KYCRequest {
  id: number;
  user_id: number;
  email: string;
  full_name: string;
  submitted_at: string;
  verified_at?: string;
  status: string;
  id_card_front: string;
  id_card_back: string;
  selfie_path: string;
  rejection_reason?: string;
}

// Định nghĩa interface AdminStats
export interface AdminStats {
  totalUsers: number;
  verifiedUsers: number;
  pendingUsers: number;
  verificationRate: string;
}

// Định nghĩa API Endpoints
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Admin', 'Users', 'KYCRequests', 'Statistics'],
  endpoints: (builder) => ({
    // Endpoint kiểm tra quyền admin
    checkAdmin: builder.query<{ is_admin: boolean; role: string }, void>({
      query: () => '/admin/check-admin',
      providesTags: ['Admin'],
    }),

    // Quản lý người dùng
    getUsers: builder.query<{ users: User[]; total: number }, { page?: number; perPage?: number; search?: string }>({
      query: ({ page = 1, perPage = 10, search = '' }) => ({
        url: '/admin/users',
        params: { page, per_page: perPage, search },
      }),
      providesTags: ['Users'],
    }),

    getUserDetails: builder.query<User, number>({
      query: (userId) => `/admin/users/${userId}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    updateUser: builder.mutation<User, Partial<User> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `/admin/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id },
        'Users',
      ],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    // Quản lý KYC
    getKYCRequests: builder.query<
      { requests: KYCRequest[]; total: number },
      { page?: number; perPage?: number; search?: string; status?: string }
    >({
      query: ({ page = 1, perPage = 10, search = '', status = 'all' }) => {
        const params: Record<string, string | number> = { page, per_page: perPage, search };
        if (status !== 'all') {
          params.status = status;
        }
        return {
          url: '/admin/kyc-requests',
          params,
        };
      },
      providesTags: ['KYCRequests'],
    }),

    getKYCRequestDetails: builder.query<KYCRequest, number>({
      query: (kycId) => `/admin/kyc-requests/${kycId}`,
      providesTags: (result, error, id) => [{ type: 'KYCRequests', id }],
    }),

    approveKYC: builder.mutation<void, number>({
      query: (kycId) => ({
        url: `/admin/kyc-requests/${kycId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'KYCRequests', id },
        'KYCRequests',
        'Statistics',
      ],
    }),

    rejectKYC: builder.mutation<void, { kycId: number; reason: string }>({
      query: ({ kycId, reason }) => ({
        url: `/admin/kyc-requests/${kycId}/reject`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (result, error, { kycId }) => [
        { type: 'KYCRequests', kycId },
        'KYCRequests',
        'Statistics',
      ],
    }),

    // Thống kê
    getStatistics: builder.query<AdminStats, void>({
      query: () => '/admin/statistics',
      providesTags: ['Statistics'],
    }),
  }),
});

// Export các hooks được tạo tự động
export const {
  useCheckAdminQuery,
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetKYCRequestsQuery,
  useGetKYCRequestDetailsQuery,
  useApproveKYCMutation,
  useRejectKYCMutation,
  useGetStatisticsQuery,
} = adminApi; 