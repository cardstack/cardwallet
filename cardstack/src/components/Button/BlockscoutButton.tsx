import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import { Button } from '@cardstack/components';
import { normalizeTxHash } from '@cardstack/utils';

export const BlockscoutButton = ({
  network,
  transactionHash,
}: {
  network: string;
  transactionHash: string;
}) => {
  const onPress = useCallback(() => {
    const blockExplorer = getConstantByNetwork('blockExplorer', network);
    const normalizedHash = normalizeTxHash(transactionHash);
    Linking.openURL(`${blockExplorer}/tx/${normalizedHash}`);
  }, [network, transactionHash]);

  return (
    <Button
      marginBottom={12}
      onPress={onPress}
      variant="smallWhite"
      width="100%"
    >
      View on Blockscout
    </Button>
  );
};
