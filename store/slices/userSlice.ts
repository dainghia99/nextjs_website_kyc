import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface User {
  id?: string;
  email?: string;
  kyc_status?: string;
  isLoggedIn: boolean;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk để lấy thông tin user từ localStorage
export const initializeUserFromStorage = createAsyncThunk(
  'user/initializeFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      // Tương tự logic trong page.tsx nhưng được quản lý bởi Redux
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        return { isLoggedIn: false };
      }
      
      const userData = JSON.parse(userStr);
      return { ...userData, isLoggedIn: true };
    } catch (error) {
      return rejectWithValue('Error initializing user from storage');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setKycStatus: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.kyc_status = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeUserFromStorage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeUserFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.isLoggedIn ? action.payload : null;
      })
      .addCase(initializeUserFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, setKycStatus, logout } = userSlice.actions;
export default userSlice.reducer; 