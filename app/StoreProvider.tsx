"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../store/store";

interface StoreProviderProps {
    children: React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preloadedState?: Record<string, any>;
}

export default function StoreProvider({
    children,
    preloadedState = {},
}: StoreProviderProps) {
    const storeRef = useRef<AppStore | null>(null);

    if (!storeRef.current) {
        // Tạo store với preloadedState (nếu có) để tránh data fetching không cần thiết
        storeRef.current = makeStore();

        // Nếu preloadedState chứa dữ liệu, đưa vào store để tránh phải fetch lại
        if (Object.keys(preloadedState).length > 0) {
            // Có thể xử lý preloadedState từ server
        }
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}
