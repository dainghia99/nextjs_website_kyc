# Hướng dẫn sử dụng Redux Toolkit trong dự án

## Cấu trúc Redux Toolkit

Dự án sử dụng Redux Toolkit với cấu trúc hiện đại và tối ưu hiệu năng:

```
/store
├── index.ts             # File export tất cả
├── store.ts             # Cấu hình store
├── hooks.ts             # Custom hooks
├── /slices              # State domain slices
│   ├── counterSlice.ts  # Ví dụ slice
│   └── userSlice.ts     # User slice
├── /selectors           # Memoized selectors
│   ├── counterSelectors.ts
│   └── userSelectors.ts
└── /services            # RTK Query API services
    └── kycApi.ts        # API cho KYC
```

## Cách sử dụng Redux trong components

### 1. Import các hooks và selectors

```tsx
'use client'; // Luôn sử dụng 'use client' cho components sử dụng hooks

import { useAppSelector, useAppDispatch } from '@/store/hooks';
// Hoặc sử dụng từ file index
import { useAppSelector, useAppDispatch } from '@/store';

// Import các actions
import { setUser, logout } from '@/store/slices/userSlice';
// Hoặc sử dụng từ file index
import { setUser, logout } from '@/store';

// Import các selectors đã tối ưu
import { selectUser, selectIsLoggedIn } from '@/store/selectors/userSelectors';
// Hoặc sử dụng từ file index
import { selectUser, selectIsLoggedIn } from '@/store';
```

### 2. Sử dụng state từ Redux

```tsx
function MyComponent() {
  // Lấy state từ Redux store
  const user = useAppSelector(selectUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  
  // Dispatch actions
  const dispatch = useAppDispatch();
  
  // Xử lý đăng xuất
  const handleLogout = () => {
    dispatch(logout());
    // Xử lý phía client (ví dụ: xóa localStorage)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  
  // Render component dựa trên state
  return (
    <div>
      {isLoggedIn ? (
        <div>
          <p>Xin chào, {user?.email}</p>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      ) : (
        <p>Vui lòng đăng nhập</p>
      )}
    </div>
  );
}
```

### 3. Sử dụng RTK Query cho data fetching

```tsx
'use client';

import { useGetKycStatusQuery, useSubmitKycMutation } from '@/store/services/kycApi';
// Hoặc sử dụng từ file index
import { useGetKycStatusQuery, useSubmitKycMutation } from '@/store';

function KycComponent() {
  // Lấy data với RTK Query
  const { data, isLoading, error, refetch } = useGetKycStatusQuery();
  
  // Sử dụng mutation
  const [submitKyc, { isLoading: isSubmitting }] = useSubmitKycMutation();
  
  const handleSubmit = async (formData) => {
    try {
      const result = await submitKyc(formData).unwrap();
      // Xử lý kết quả
      if (result.success) {
        alert('Gửi thông tin thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi gửi thông tin:', error);
    }
  };
  
  if (isLoading) return <div>Đang tải...</div>;
  
  return (
    <div>
      <h2>Trạng thái KYC: {data?.status}</h2>
      <button onClick={refetch}>Cập nhật</button>
      
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang gửi...' : 'Gửi thông tin'}
        </button>
      </form>
    </div>
  );
}
```

### 4. Tạo slice mới cho các tính năng khác

Khi cần thêm tính năng mới, hãy tạo slice riêng trong thư mục `/store/slices`:

```tsx
// /store/slices/notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
```

Sau đó thêm reducer vào store:

```tsx
// store.ts - trong configureStore
reducer: {
  counter: counterReducer,
  user: userReducer,
  notification: notificationReducer,
  [kycApi.reducerPath]: kycApi.reducer,
},
```

### 5. Tạo API service mới với RTK Query

Để thêm API endpoints mới:

```tsx
// /store/services/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
```

Sau đó thêm service vào store:

```tsx
// store.ts
import { authApi } from './services/authApi';

// Trong configureStore:
reducer: {
  // ...các reducer khác
  [authApi.reducerPath]: authApi.reducer,
},
middleware: (getDefaultMiddleware) => 
  getDefaultMiddleware()
    .concat(kycApi.middleware)
    .concat(authApi.middleware),
```

## Mẹo tối ưu hiệu năng

1. **Sử dụng selectors đã tối ưu**: Luôn dùng selectors từ thư mục `/selectors` thay vì truy cập state trực tiếp.

2. **Memoize components**: Sử dụng `React.memo()` cho components để tránh re-render không cần thiết.

3. **Tách nhỏ components**: Tách UI thành các component nhỏ để giảm render không cần thiết.

4. **Sử dụng RTK Query**: Ưu tiên sử dụng RTK Query thay vì tự quản lý state cho API calls.

5. **Chỉ dispatch actions khi cần thiết**: Tránh dispatch actions trong vòng lặp render.

## Thêm TypeScript types

```tsx
// Sử dụng RootState và AppDispatch
import { RootState, AppDispatch } from '@/store/store';
// hoặc từ index
import { RootState, AppDispatch } from '@/store';

// Khai báo type cho component props
interface MyComponentProps {
  initialValue?: number;
}

// Sử dụng trong component
const MyComponent: React.FC<MyComponentProps> = ({ initialValue = 0 }) => {
  // component code
};
``` 