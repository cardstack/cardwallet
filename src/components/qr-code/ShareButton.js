import React, { useCallback } from 'react';
import { Share } from 'react-native';
import { Button } from '@cardstack/components';

export default function ShareButton({ accountAddress }) {
  const handlePress = useCallback(() => {
    Share.share({
      message: accountAddress,
      title: 'My account address:',
    });
  }, [accountAddress]);

  return (
    <Button
      iconProps={{ name: 'share', iconSize: 'medium' }}
      onPress={handlePress}
    >
      Share
    </Button>
  );
}
