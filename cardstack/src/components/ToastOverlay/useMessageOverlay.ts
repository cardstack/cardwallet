import { useNavigation } from '@react-navigation/native';
import { useCallback, ReactNode } from 'react';

import { Routes, useDismissCurrentRoute } from '@cardstack/navigation';

import { useTimeout } from '@rainbow-me/hooks';

const defaultDuration = 3000;

export interface MessageOverlayParams {
  message: string | ReactNode;
  duration?: number;
}

export const useMessageOverlay = () => {
  const { navigate } = useNavigation();

  const [startTimeout, stopTimeout] = useTimeout();

  const dismissMessage = useDismissCurrentRoute(Routes.MESSAGE_OVERLAY);

  const showMessage = useCallback(
    ({ message, duration = defaultDuration }: MessageOverlayParams) => {
      navigate(Routes.MESSAGE_OVERLAY, { message });

      if (duration) {
        stopTimeout();
        startTimeout(dismissMessage, duration);
      }
    },
    [navigate, dismissMessage, stopTimeout, startTimeout]
  );

  return { showMessage, dismissMessage };
};
