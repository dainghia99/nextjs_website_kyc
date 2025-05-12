import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Định nghĩa API base URL từ biến môi trường hoặc hardcode
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Định nghĩa interface VerifiedAccount
export interface VerifiedAccount {
    id: number;
    email: string;
    full_name: string;
    verified_at: string;
    status: string;
}

// Định nghĩa interface IdentityInfo
export interface IdentityInfo {
    id_number: string;
    full_name: string;
    date_of_birth: string;
    gender: string;
    nationality: string;
    issue_date: string;
    expiry_date: string;
}

// Định nghĩa interface KycStatusResponse
export interface KycStatusResponse {
    status: string;
    identity_info?: IdentityInfo;
    id_card_verified?: boolean;
    liveness_verified?: boolean;
}

// Định nghĩa interface FaceVerificationStatus
export interface FaceVerificationStatus {
    face_verified: boolean;
    face_match: boolean;
    selfie_uploaded: boolean;
}

// Tạo API với RTK Query
export const kycApi = createApi({
    reducerPath: "kycApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        // Thêm token vào header cho mọi request
        prepareHeaders: (headers) => {
            // Lấy token từ localStorage
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("token")
                    : null;

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ["KycStatus", "FaceStatus"],
    // Các endpoints của API
    endpoints: (builder) => ({
        // Lấy trạng thái KYC
        getKycStatus: builder.query<KycStatusResponse, void>({
            query: () => "/kyc/status",
            providesTags: ["KycStatus"],
        }),

        // Lấy trạng thái xác minh khuôn mặt
        getFaceVerificationStatus: builder.query<FaceVerificationStatus, void>({
            query: () => "/face-verification/status",
            providesTags: ["FaceStatus"],
        }),

        // Tải lên ảnh CCCD
        uploadIdCard: builder.mutation<
            { success: boolean; message: string; id_info?: IdentityInfo },
            { file: File; isFront: boolean }
        >({
            query: ({ file, isFront }) => {
                const formData = new FormData();
                formData.append("image", file);

                return {
                    url: `/kyc/verify/id-card?front=${isFront}`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["KycStatus"],
        }),

        // Xác nhận thông tin CCCD
        confirmIdCardInfo: builder.mutation<
            { success: boolean; message: string },
            IdentityInfo
        >({
            query: (identityInfo) => ({
                url: "/kyc/confirm-id-card-info",
                method: "POST",
                body: identityInfo,
            }),
            invalidatesTags: ["KycStatus"],
        }),

        // Xác minh khuôn mặt
        verifyFaceMatch: builder.mutation<
            { success: boolean; message: string; match: boolean },
            File
        >({
            query: (file) => {
                const formData = new FormData();
                formData.append("image", file);

                return {
                    url: "/face-verification/verify",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["KycStatus", "FaceStatus"],
        }),

        // Xác minh liveness
        verifyLiveness: builder.mutation<
            {
                message: string;
                liveness_score: number;
                blink_count: number;
                attempt_count: number;
                status: string;
            },
            FormData
        >({
            query: (data) => ({
                url: "/kyc/verify/liveness",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["KycStatus"],
        }),

        // Gửi thông tin KYC
        submitKyc: builder.mutation<
            { success: boolean; message: string },
            FormData
        >({
            query: (data) => ({
                url: "/kyc/submit",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["KycStatus"],
        }),

        // Lấy lịch sử KYC
        getKycHistory: builder.query<any[], void>({
            query: () => "/kyc/history",
        }),

        // Lấy danh sách tài khoản đã xác minh KYC
        getVerifiedAccounts: builder.query<
            { accounts: VerifiedAccount[] },
            void
        >({
            query: () => "/kyc/verified-accounts",
        }),
    }),
});

// Export các hooks được tạo tự động
export const {
    useGetKycStatusQuery,
    useGetFaceVerificationStatusQuery,
    useUploadIdCardMutation,
    useConfirmIdCardInfoMutation,
    useVerifyFaceMatchMutation,
    useVerifyLivenessMutation,
    useSubmitKycMutation,
    useGetKycHistoryQuery,
    useGetVerifiedAccountsQuery,
} = kycApi;
