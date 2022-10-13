import { useNavigation } from '@react-navigation/native';
import { useCallback, useRef, ReactNode } from 'react';

import { Routes, useDismissCurrentRoute } from '@cardstack/navigation';

const defaultParams = {
  duration: 3000,
  loading: false,
};

export interface ToastOverlayParams {
  message: string | ReactNode;
  loading?: boolean;
  duration?: number;
}

export const useToast = () => {
  const { navigate } = useNavigation();

  const timeoutHandle = useRef<number>();

  const dismissToast = useDismissCurrentRoute(Routes.TOAST_OVERLAY);

  const showToast = useCallback(
    (options?: ToastOverlayParams) => {
      const params = { ...defaultParams, ...options };
      navigate(Routes.TOAST_OVERLAY, params);

      if (params.duration) {
        if (timeoutHandle.current) {
          clearTimeout(timeoutHandle.current);
        }

        timeoutHandle.current = setTimeout(
          () => dismissToast(),
          params.duration
        );
      }
    },
    [navigate, dismissToast]
  );

  return { showToast, dismissToast };
};
