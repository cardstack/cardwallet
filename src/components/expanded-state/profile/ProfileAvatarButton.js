import React, { useCallback } from 'react';
import { ContactAvatar } from '../../contacts';
import { AnimatedPressable } from '@cardstack/components';

const ProfileAvatarButton = ({ color, marginBottom = 15, setColor, value }) => {
  const { colors } = useTheme();
  const handleChangeColor = useCallback(
    () => setColor?.(prevColor => (prevColor + 1) % colors.avatarColor.length),
    [setColor, colors]
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
