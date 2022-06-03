import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as BiometricAuth from '@cardstack/models/biometric-auth';
import {
  authenticate as storeAuthenticate,
  revoke as storeRevoke,
  selectIsLocallyAuthenticated,
} from '@cardstack/redux/localAuthenticationSlice';

export const useLocalAuth = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsLocallyAuthenticated());

  const authenticate = useCallback(async () => {
    if (isAuthenticated) return;

    const success = await BiometricAuth.authenticate();

    if (success) {
      dispatch(storeAuthenticate());
    }
  }, [isAuthenticated, dispatch]);

  const revoke = useCallback(() => dispatch(storeRevoke()), [dispatch]);

  return { authenticate, revoke, isAuthenticated };
};
