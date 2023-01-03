import React, { useCallback } from 'react';
import { ContactAvatar } from '../../contacts';
import { AnimatedPressable } from '@cardstack/components';
import colors from '@rainbow-me/styles/colors';

const ProfileAvatarButton = ({ color, marginBottom = 15, setColor, value }) => {
  const handleChangeColor = useCallback(
    () => setColor?.(prevColor => (prevColor + 1) % colors.avatarColor.length),
    [setColor]
  );

  return (
    <AnimatedPressable onPress={handleChangeColor}>
      <ContactAvatar
        color={color}
        marginBottom={marginBottom}
        size="large"
        value={value}
      />
    </AnimatedPressable>
  );
};

export default React.memo(ProfileAvatarButton);
