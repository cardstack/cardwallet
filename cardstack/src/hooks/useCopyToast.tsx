import React, { useCallback, useMemo } from 'react';
import { Container, ContainerProps } from '@cardstack/components';
import { useBooleanState, useClipboard, useTimeout } from '@rainbow-me/hooks';
import { screenHeight } from '@cardstack/utils';
import Toast from '@rainbow-me/components/toasts/Toast';

interface useCopyToastParams {
  customCopyLabel?: string;
  dataToCopy: string;
}

const toastBottomPosition = screenHeight * 0.1;
const displayDuration = 2000;

export const useCopyToast = ({
  customCopyLabel,
  dataToCopy,
}: useCopyToastParams) => {
  const [isVisible, showCopyToast, hideCopyToast] = useBooleanState();

  const [startTimeout, stopTimeout] = useTimeout();

  const { setClipboard, clipboard } = useClipboard();

  const CopyToastComponent = useMemo(() => {
    const CopyToast = (props: ContainerProps) =>
      isVisible ? (
        <Container
          zIndex={2}
          position="absolute"
          width="100%"
          bottom={toastBottomPosition}
          {...props}
        >
          <Toast
            isVisible={isVisible}
            text={`Copied "${customCopyLabel || clipboard}" to clipboard`}
          />
        </Container>
      ) : null;

    return CopyToast;
  }, [clipboard, customCopyLabel, isVisible]);

  const copyToClipboard = useCallback(() => {
    stopTimeout();

    setClipboard(dataToCopy);

    showCopyToast();

    startTimeout(hideCopyToast, displayDuration);
  }, [
    dataToCopy,
    hideCopyToast,
    setClipboard,
    showCopyToast,
    startTimeout,
    stopTimeout,
  ]);

  return {
    CopyToastComponent,
    copyToClipboard,
  };
};
