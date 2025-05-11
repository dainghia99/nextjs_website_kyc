import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Selector cơ bản
const selectUserState = (state: RootState) => state.user;

// Selector cho user object
export const selectUser = createSelector(
  [selectUserState],
  (userState) => userState.user
);

// Selector cho trạng thái đăng nhập
export const selectIsLoggedIn = createSelector(
  [selectUserState],
  (userState) => !!userState.user?.isLoggedIn
);

// Selector cho loading state
export const selectUserLoading = createSelector(
  [selectUserState],
  (userState) => userState.loading
);

// Selector cho error
export const selectUserError = createSelector(
  [selectUserState],
  (userState) => userState.error
);

// Selector cho KYC status
export const selectKycStatus = createSelector(
  [selectUser],
  (user) => user?.kyc_status || 'pending'
);

// Selector cho KYC verification status
export const selectIsKycVerified = createSelector(
  [selectKycStatus],
  (kycStatus) => kycStatus === 'verified'
); 