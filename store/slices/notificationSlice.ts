import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number; // Thời gian tồn tại (ms), mặc định 3000ms
}

export interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Thêm thông báo mới
    addNotification: {
      reducer: (state, action: PayloadAction<Notification>) => {
        state.notifications.push(action.payload);
      },
      // Tự động tạo id nếu không được cung cấp
      prepare: (notification: Omit<Notification, 'id'> & { id?: string }) => {
        const { id = uuidv4(), ...rest } = notification;
        return { payload: { id, ...rest } };
      },
    },
    
    // Xóa thông báo theo id
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    
    // Xóa tất cả thông báo
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { 
  addNotification, 
  removeNotification, 
  clearAllNotifications 
} = notificationSlice.actions;

export default notificationSlice.reducer; 