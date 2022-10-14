import React, { useCallback } from 'react';

import { useToast, Text } from '@cardstack/components';

import { useClipboard } from '@rainbow-me/hooks';

interface useCopyToastParams {
  customCopyLabel?: string;
  dataToCopy?: string;
}

export const useCopyToast = ({
  customCopyLabel,
  dataToCopy,
}: useCopyToastParams) => {
  const { setClipboard, clipboard } = useClipboard();

  const { showToast } = useToast();

  const copyToClipboard = useCallback(
    (copy?: string) => {
      setClipboard(dataToCopy || copy);
      showToast({
        message: (
          <Text>
            Copied "
            <Text variant="bold">{customCopyLabel || copy || clipboard}</Text>"
            to clipboard
          </Text>
        ),
      });
    },
    [clipboard, customCopyLabel, dataToCopy, showToast, setClipboard]
  );

  return {
    copyToClipboard,
  };
};
