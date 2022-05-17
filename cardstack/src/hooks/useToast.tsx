import React, { useCallback, useEffect, useState, useMemo } from 'react';

import { Container, ContainerProps } from '@cardstack/components';
import { screenHeight } from '@cardstack/utils';

import Toast from '@rainbow-me/components/toasts/Toast';
import { useTimeout } from '@rainbow-me/hooks';

import { useBooleanState } from './useBooleanState';

interface ToastProps {
  label?: string;
  duration?: number;
}

const toastBottomPosition = screenHeight * 0.1;
const defaultDuration = 2000;

export const useToast = ({
  label,
  duration = defaultDuration,
}: Partial<ToastProps> = {}) => {
  const [isVisible, showToast, hideToast] = useBooleanState();
  const [currentLabel, setLabel] = useState(label);
  const [currentDuration, setDuration] = useState(duration);

  const [startTimeout, stopTimeout] = useTimeout();

  useEffect(() => {
    if (isVisible) {
      stopTimeout();
      startTimeout(hideToast, currentDuration);
    }
  }, [currentDuration, startTimeout, stopTimeout, hideToast, isVisible]);

  const setToast = useCallback(
    ({
      label: newLabel,
      duration: newDuration = defaultDuration,
    }: ToastProps) => {
      setLabel(newLabel);
      setDuration(newDuration);
      showToast();
    },
    [setLabel, showToast]
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
    setToast,
  };
};
