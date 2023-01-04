import React, { useCallback } from 'react';
import { ContactAvatar } from '../../contacts';
import { AnimatedPressable } from '@cardstack/components';
import { avatarColor } from '@cardstack/theme';

const ProfileAvatarButton = ({ color, marginBottom = 15, setColor, value }) => {
  const handleChangeColor = useCallback(
    () => setColor?.(prevColor => (prevColor + 1) % avatarColor.length),
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
