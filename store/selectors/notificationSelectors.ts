import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { NotificationType } from '../slices/notificationSlice';

// Selector cơ bản
const selectNotificationState = (state: RootState) => state.notification;

// Selector cho tất cả thông báo
export const selectAllNotifications = createSelector(
  [selectNotificationState],
  (notificationState) => notificationState.notifications
);

// Selector cho số lượng thông báo
export const selectNotificationCount = createSelector(
  [selectAllNotifications],
  (notifications) => notifications.length
);

// Selector để lọc thông báo theo loại
export const selectNotificationsByType = (type: NotificationType) =>
  createSelector(
    [selectAllNotifications],
    (notifications) => notifications.filter((notification) => notification.type === type)
  );

// Selector để kiểm tra xem có thông báo lỗi không
export const selectHasErrorNotifications = createSelector(
  [selectAllNotifications],
  (notifications) => notifications.some((notification) => notification.type === 'error')
);

// Selector để kiểm tra xem có thông báo thành công không
export const selectHasSuccessNotifications = createSelector(
  [selectAllNotifications],
  (notifications) => notifications.some((notification) => notification.type === 'success')
); 