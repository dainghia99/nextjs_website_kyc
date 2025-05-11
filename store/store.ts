import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import notificationReducer from './slices/notificationSlice';
import { kycApi } from './services/kycApi';
import { authApi } from './services/authApi';
import { adminApi } from './services/adminApi';
import { setupListeners } from '@reduxjs/toolkit/query';

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      user: userReducer,
      notification: notificationReducer,
      // Thêm reducer của RTK Query API
      [kycApi.reducerPath]: kycApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [adminApi.reducerPath]: adminApi.reducer,
      // Thêm các slice reducers khác ở đây
    },
    // Tối ưu hiệu năng với DevTools
    devTools: process.env.NODE_ENV !== 'production',
    // Cấu hình middleware để tối ưu hiệu năng, thêm RTK Query middleware
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
        // Tắt serializableCheck trong production để tăng hiệu năng
        serializableCheck: process.env.NODE_ENV !== 'production',
        // Vô hiệu hóa immutabilityCheck trong production
        immutableCheck: process.env.NODE_ENV !== 'production',
      })
        .concat(kycApi.middleware)
        .concat(authApi.middleware)
        .concat(adminApi.middleware),
  });

  // Kích hoạt các tính năng RTK Query như refetchOnFocus/refetchOnReconnect
  setupListeners(store.dispatch);
  
  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch']; 