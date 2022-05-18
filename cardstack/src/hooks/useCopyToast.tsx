import { useCallback } from 'react';

import { useClipboard } from '@rainbow-me/hooks';

import { useBottomToast } from './useBottomToast';

interface useCopyToastParams {
  customCopyLabel?: string;
  dataToCopy: string;
}

export const useCopyToast = ({
  customCopyLabel,
  dataToCopy,
}: useCopyToastParams) => {
  const { setClipboard, clipboard } = useClipboard();

  const { ToastComponent, showToast } = useBottomToast();

  const copyToClipboard = useCallback(() => {
    setClipboard(dataToCopy);
    showToast({
      label: `Copied "${customCopyLabel || clipboard}" to clipboard`,
    });
  }, [clipboard, customCopyLabel, dataToCopy, showToast, setClipboard]);

  return {
    CopyToastComponent: ToastComponent,
    copyToClipboard,
  };
};
