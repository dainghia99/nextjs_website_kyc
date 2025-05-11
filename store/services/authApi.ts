import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../slices/userSlice';

// Định nghĩa API base URL từ biến môi trường hoặc hardcode
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Định nghĩa các interface
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

// Tạo API với RTK Query
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  endpoints: (builder) => ({
    // Đăng nhập
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // Đăng ký
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    
    // Đăng xuất (gửi token để blacklist ở server nếu cần)
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${
            typeof window !== 'undefined' ? localStorage.getItem('token') : ''
          }`,
        },
      }),
    }),
  }),
});

// Export các hooks được tạo tự động
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi; 