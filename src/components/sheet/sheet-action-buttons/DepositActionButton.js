import React, { useCallback, useState } from 'react';
import { ComingSoonFloatingEmojis } from '../../floating-emojis';
import SheetActionButton from './SheetActionButton';
import { neverRerender } from '@rainbow-me/utils';

function DepositActionButton({ color: givenColor, ...props }) {
  const { colors, isDarkMode } = useTheme();
  const color = givenColor || (isDarkMode ? colors.darkModeDark : colors.dark);
  const [didTrack, setDidTrack] = useState(false);

  const handlePress = useCallback(() => {
    if (!didTrack) {
      setDidTrack(true);
    }
  }, [didTrack]);

  return (
    <ComingSoonFloatingEmojis>
      <SheetActionButton
        {...props}
        color={color}
        label="􀁍 Deposit"
        onPress={handlePress}
      />
    </ComingSoonFloatingEmojis>
  );
}

export default neverRerender(DepositActionButton);
