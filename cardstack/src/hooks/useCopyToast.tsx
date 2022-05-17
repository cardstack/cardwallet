import { useCallback } from 'react';

import { useClipboard } from '@rainbow-me/hooks';

import { useToast } from './useToast';

interface useCopyToastParams {
  customCopyLabel?: string;
  dataToCopy: string;
}

export const useCopyToast = ({
  customCopyLabel,
  dataToCopy,
}: useCopyToastParams) => {
  const { setClipboard, clipboard } = useClipboard();

  const { ToastComponent, showToast } = useToast({
    label: `Copied "${customCopyLabel || clipboard}" to clipboard`,
  });

  const copyToClipboard = useCallback(() => {
    setClipboard(dataToCopy);
    showToast();
  }, [dataToCopy, showToast, setClipboard]);

  return {
    CopyToastComponent: ToastComponent,
    copyToClipboard,
  };
};
