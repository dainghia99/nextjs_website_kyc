"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { addNotification } from "@/store/slices/notificationSlice";
import { IdentityInfo } from "@/store/services/kycApi";

interface IdCardInfoProps {
    identityInfo: IdentityInfo;
    onConfirm: (updatedInfo: IdentityInfo) => void;
    onCancel: () => void;
}

export default function IdCardInfo({
    identityInfo,
    onConfirm,
    onCancel,
}: IdCardInfoProps) {
    const dispatch = useAppDispatch();
    const [editableInfo, setEditableInfo] =
        useState<IdentityInfo>(identityInfo);

    // Hàm xử lý khi người dùng thay đổi thông tin trong input
    const handleInputChange = (field: keyof IdentityInfo, value: string) => {
        setEditableInfo((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Hàm xử lý khi người dùng xác nhận thông tin
    const handleConfirm = () => {
        // Kiểm tra các trường bắt buộc
        const requiredFields: (keyof IdentityInfo)[] = [
            "id_number",
            "full_name",
            "gender",
            "nationality",
            "issue_date",
            "expiry_date",
        ];

        const missingFields = requiredFields.filter(
            (field) => !editableInfo[field]
        );

        if (missingFields.length > 0) {
            dispatch(
                addNotification({
                    message: `Vui lòng điền đầy đủ thông tin: ${missingFields.join(
                        ", "
                    )}`,
                    type: "error",
                    duration: 5000,
                })
            );
            return;
        }

        onConfirm(editableInfo);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
                Xác nhận thông tin CCCD
            </h2>

            {/* Thông báo */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg mb-6">
                <p className="text-sm text-orange-800">
                    Bạn hãy kiểm tra lại thông tin xem có khớp với thông tin
                    trong căn cước của bạn không? Nếu không vui lòng sửa lại.
                    Bạn hãy đảm bảo trung thực thông tin cá nhân của bạn đúng
                    với thông tin trong căn cước của bạn, vì thông tin này không
                    được sửa lại. Nếu bạn khai sai sự thật hoặc có hành vi gian
                    dối thì bạn sẽ phải tự chịu trách nhiệm trước pháp luật.
                </p>
            </div>

            {/* Form thông tin */}
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Số CCCD */}
                    <div>
                        <label
                            htmlFor="id_number"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Số CCCD
                        </label>
                        <input
                            type="text"
                            id="id_number"
                            value={editableInfo.id_number || ""}
                            onChange={(e) =>
                                handleInputChange("id_number", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>

                    {/* Họ và tên */}
                    <div>
                        <label
                            htmlFor="full_name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            id="full_name"
                            value={editableInfo.full_name || ""}
                            onChange={(e) =>
                                handleInputChange("full_name", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>

                    {/* Giới tính */}
                    <div>
                        <label
                            htmlFor="gender"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Giới tính
                        </label>
                        <input
                            type="text"
                            id="gender"
                            value={editableInfo.gender || ""}
                            onChange={(e) =>
                                handleInputChange("gender", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>

                    {/* Quốc tịch */}
                    <div>
                        <label
                            htmlFor="nationality"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Quốc tịch
                        </label>
                        <input
                            type="text"
                            id="nationality"
                            value={editableInfo.nationality || ""}
                            onChange={(e) =>
                                handleInputChange("nationality", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>

                    {/* Ngày cấp */}
                    <div>
                        <label
                            htmlFor="issue_date"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Ngày cấp
                        </label>
                        <input
                            type="text"
                            id="issue_date"
                            value={editableInfo.issue_date || ""}
                            onChange={(e) =>
                                handleInputChange("issue_date", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                            placeholder="DD/MM/YYYY"
                        />
                    </div>

                    {/* Ngày hết hạn */}
                    <div>
                        <label
                            htmlFor="expiry_date"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Ngày hết hạn
                        </label>
                        <input
                            type="text"
                            id="expiry_date"
                            value={editableInfo.expiry_date || ""}
                            onChange={(e) =>
                                handleInputChange("expiry_date", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                            placeholder="DD/MM/YYYY"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    >
                        Xác nhận thông tin
                    </button>
                </div>
            </div>
        </div>
    );
}
