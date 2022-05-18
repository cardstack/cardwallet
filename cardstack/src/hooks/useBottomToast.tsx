import React, { useCallback, useEffect, useState, useMemo } from 'react';

import { Container, ContainerProps } from '@cardstack/components';
import { screenHeight } from '@cardstack/utils';

import Toast from '@rainbow-me/components/toasts/Toast';
import { useTimeout } from '@rainbow-me/hooks';

import { useBooleanState } from './useBooleanState';

interface ToastProps {
  label: string;
  duration?: number;
}

const toastBottomPosition = screenHeight * 0.1;
const defaultDuration = 2000;

export const useBottomToast = () => {
  const [isVisible, displayToast, hideToast] = useBooleanState();
  const [currentLabel, setLabel] = useState('');
  const [currentDuration, setDuration] = useState(defaultDuration);

  const [startTimeout, stopTimeout] = useTimeout();

  useEffect(() => {
    if (isVisible) {
      stopTimeout();
      startTimeout(hideToast, currentDuration);
    }
  }, [currentDuration, startTimeout, stopTimeout, hideToast, isVisible]);

  const showToast = useCallback(
    ({
      label: newLabel,
      duration: newDuration = defaultDuration,
    }: ToastProps) => {
      setLabel(newLabel);
      setDuration(newDuration);
      displayToast();
    },
    [setLabel, displayToast]
  );

  const ToastComponent = useMemo(() => {
    const CopyToast = (props: ContainerProps) =>
      isVisible ? (
        <Container
          zIndex={2}
          position="absolute"
          width="100%"
          bottom={toastBottomPosition}
          {...props}
        >
          <Toast isVisible={isVisible} text={currentLabel} />
        </Container>
      ) : null;

    return CopyToast;
  }, [currentLabel, isVisible]);

  return {
    ToastComponent,
    showToast,
    hideToast,
  };
};
