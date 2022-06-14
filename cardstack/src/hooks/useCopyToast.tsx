import { useCallback } from 'react';

import { useClipboard } from '@rainbow-me/hooks';

import { useBottomToast } from './useBottomToast';

interface useCopyToastParams {
  customCopyLabel?: string;
  dataToCopy?: string;
}

export const useCopyToast = ({
  customCopyLabel,
  dataToCopy,
}: useCopyToastParams) => {
  const { setClipboard, clipboard } = useClipboard();

  const { ToastComponent, showToast } = useBottomToast();

  const copyToClipboard = useCallback(
    (copy?: string) => {
      setClipboard(dataToCopy || copy);
      showToast({
        label: `Copied "${customCopyLabel || copy || clipboard}" to clipboard`,
      });
    },
    [clipboard, customCopyLabel, dataToCopy, showToast, setClipboard]
  );

  return {
    CopyToastComponent: ToastComponent,
    copyToClipboard,
  };
};
