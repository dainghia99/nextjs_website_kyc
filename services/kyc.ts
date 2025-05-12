import api from "./api";

export const getKYCStatus = async () => {
    const response = await api.get("/kyc/status");
    return response.data;
};

export const getVerifiedAccounts = async () => {
    const response = await api.get("/kyc/verified-accounts");
    return response.data;
};

export const getFaceVerificationStatus = async () => {
    const response = await api.get("/face-verification/status");
    return response.data;
};

export const uploadIDCard = async (imageFile: File, isFront: boolean) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await api.post(
        `/kyc/verify/id-card?front=${isFront}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const verifyFaceMatch = async (selfieFile: File) => {
    const formData = new FormData();
    formData.append("image", selfieFile);

    const response = await api.post("/face-verification/verify", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const verifyLiveness = async (formData: FormData) => {
    const response = await api.post("/kyc/verify/liveness", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const confirmIdCardInfo = async (identityInfo: any) => {
    const response = await api.post("/kyc/confirm-id-card-info", identityInfo);
    return response.data;
};

export const processImageDirect = async (
    imagePath: string,
    isFront: boolean,
    updateKYC: boolean = true
) => {
    const response = await api.post("/ocr/process", {
        image_path: imagePath,
        is_front: isFront,
        update_kyc: updateKYC,
    });
    return response.data;
};
