import { useNavigation } from '@react-navigation/native';
import { useCallback, ReactNode } from 'react';

import { Routes, useDismissCurrentRoute } from '@cardstack/navigation';

import { useTimeout } from '@rainbow-me/hooks';

const defaultDuration = 3000;

export interface ToastOverlayParams {
  message: string | ReactNode;
  duration?: number;
}

export const useToast = () => {
  const { navigate } = useNavigation();

  const [startTimeout, stopTimeout] = useTimeout();

  const dismissToast = useDismissCurrentRoute(Routes.TOAST_OVERLAY);

  const showToast = useCallback(
    ({ message, duration = defaultDuration }: ToastOverlayParams) => {
      navigate(Routes.TOAST_OVERLAY, { message });

      if (duration) {
        stopTimeout();
        startTimeout(dismissToast, duration);
      }
    },
    [navigate, dismissToast, stopTimeout, startTimeout]
  );

  return { showToast, dismissToast };
};
