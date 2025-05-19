/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import { useEffect, memo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectAllNotifications } from "@/store/selectors/notificationSelectors";
import { removeNotification } from "@/store/slices/notificationSlice";

function Notifications() {
    const notifications = useAppSelector(selectAllNotifications);
    const dispatch = useAppDispatch();

    // Tự động xóa thông báo sau duration ms
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        notifications.forEach((notification) => {
            const timer = setTimeout(() => {
                dispatch(removeNotification(notification.id));
            }, notification.duration || 3000);

            timers.push(timer);
        });

        // Dọn dẹp khi component unmount
        return () => {
            timers.forEach((timer) => clearTimeout(timer));
        };
    }, [notifications, dispatch]);

    // Nếu không có thông báo, không hiển thị gì
    if (!notifications.length) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`p-4 rounded-lg shadow-md flex justify-between items-start ${
                        notification.type === "success"
                            ? "bg-green-100 text-green-800"
                            : notification.type === "error"
                            ? "bg-red-100 text-red-800"
                            : notification.type === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                >
                    <div>{notification.message}</div>
                    <button
                        onClick={() =>
                            dispatch(removeNotification(notification.id))
                        }
                        className="ml-4 text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>
            ))}
        </div>
    );
}

export default memo(Notifications);
