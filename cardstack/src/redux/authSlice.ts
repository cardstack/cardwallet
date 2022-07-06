import { createSlice } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@rainbow-me/redux/store';

type SliceType = {
  isAuthorized: boolean;
  hasWallet: boolean;
  isAuthenticatingWithBiometrics: boolean;
};

const initialState: SliceType = {
  isAuthorized: false,
  hasWallet: false,
  isAuthenticatingWithBiometrics: false,
};

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setUserAuthorized(state) {
      state.isAuthorized = true;
    },
    setUserUnauthorized(state) {
      state.isAuthorized = false;
    },
    setHasWallet(state) {
      state.hasWallet = true;
    },
    resetHasWallet(state) {
      state.hasWallet = false;
    },
    authWithBiometricsStarted(state) {
      state.isAuthenticatingWithBiometrics = true;
    },
    authWithBiometricsFinished(state) {
      state.isAuthenticatingWithBiometrics = false;
    },
  },
});

export const useAuthSelector = () => {
  const authState = useSelector((state: AppState) => state.authSlice);

  return authState;
};

export const useAuthActions = () => {
  const dispatch = useDispatch();

  const setUserAuthorized = useCallback(() => {
    dispatch(authSlice.actions.setUserAuthorized());
  }, [dispatch]);

  const setUserUnauthorized = useCallback(() => {
    dispatch(authSlice.actions.setUserUnauthorized());
  }, [dispatch]);

  const setHasWallet = useCallback(() => {
    dispatch(authSlice.actions.setHasWallet());
  }, [dispatch]);

  const resetHasWallet = useCallback(() => {
    dispatch(authSlice.actions.resetHasWallet());
  }, [dispatch]);

  const authWithBiometricsStarted = useCallback(() => {
    dispatch(authSlice.actions.authWithBiometricsStarted());
  }, [dispatch]);

  const authWithBiometricsFinished = useCallback(() => {
    dispatch(authSlice.actions.authWithBiometricsFinished());
  }, [dispatch]);

  return {
    setUserAuthorized,
    setUserUnauthorized,
    setHasWallet,
    resetHasWallet,
    authWithBiometricsStarted,
    authWithBiometricsFinished,
  };
};

export const useAuthSelectorAndActions = () => {
  const selector = useAuthSelector();
  const actions = useAuthActions();

  return {
    ...selector,
    ...actions,
  };
};
