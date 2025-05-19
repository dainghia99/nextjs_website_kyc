/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
    selectUser,
    selectIsLoggedIn,
    selectUserLoading,
} from "../../store/selectors/userSelectors";
import {
    initializeUserFromStorage,
    setKycStatus,
} from "../../store/slices/userSlice";
import { useGetKycStatusQuery } from "../../store/services/kycApi";
import { useEffect, memo } from "react";
import Image from "next/image";

function UserProfile() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const isLoading = useAppSelector(selectUserLoading);

    // Sử dụng RTK Query
    const { data: kycData, isSuccess } = useGetKycStatusQuery(undefined, {
        // Chỉ fetch khi đã đăng nhập
        skip: !isLoggedIn,
        // Tự động refresh mỗi phút
        pollingInterval: 60000,
    });

    // Khởi tạo user từ localStorage
    useEffect(() => {
        dispatch(initializeUserFromStorage());
    }, [dispatch]);

    // Cập nhật trạng thái KYC từ API
    useEffect(() => {
        if (isSuccess && kycData) {
            dispatch(setKycStatus(kycData.status));
        }
    }, [isSuccess, kycData, dispatch]);

    if (isLoading) {
        return (
            <div className="p-4 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-orange-500 mr-2"></div>
                <span>Đang tải thông tin người dùng...</span>
            </div>
        );
    }

    if (!isLoggedIn || !user) {
        return (
            <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-center text-gray-500">Bạn chưa đăng nhập</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
                <Image
                    src="/Logo_DAI_NAM.png"
                    alt="Avatar"
                    width={50}
                    height={50}
                    className="rounded-full bg-white border-2 border-orange-500"
                />
                <div>
                    <h3 className="font-semibold">{user.email}</h3>
                    <div
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                            user.kyc_status === "verified"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                        {user.kyc_status === "verified"
                            ? "Đã xác minh KYC"
                            : "Chưa xác minh KYC"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(UserProfile);
