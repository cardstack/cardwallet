import React, { useCallback, useState } from 'react';
import { neverRerender } from '../../../utils';
import { ComingSoonFloatingEmojis } from '../../floating-emojis';
import SheetActionButton from './SheetActionButton';

function WithdrawActionButton({ color: givenColor, ...props }) {
  const { colors, isDarkMode } = useTheme();
  const color = givenColor || colors.white;
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
        label="􀁏 Withdraw"
        onPress={handlePress}
        textColor={isDarkMode ? colors.whiteLabel : colors.dark}
      />
    </ComingSoonFloatingEmojis>
  );
}

export default neverRerender(WithdrawActionButton);
