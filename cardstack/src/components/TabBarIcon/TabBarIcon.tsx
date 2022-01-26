import React, { memo, useMemo } from 'react';
import { Text, Icon, IconName, Container } from '@cardstack/components';
import { screenWidth } from '@cardstack/utils';
import { ColorTypes } from '@cardstack/theme';

const layouts = {
  tabIndicatorDash: {
    width: screenWidth * 0.14,
    height: 5,
  },
  activeColor: 'tealDark' as const,
  inactiveColor: 'grayText' as const,
  iconSize: 20,
};

interface TabBarIconProps {
  focused: boolean;
  iconName: IconName;
  label: string;
}

const TabBarIcon = ({ focused, iconName, label }: TabBarIconProps) => {
  const styles: Record<string, ColorTypes> = useMemo(
    () => ({
      tabIndicatorColor: focused ? layouts.activeColor : 'transparent',
      iconLabelColor: focused ? layouts.activeColor : layouts.inactiveColor,
    }),
    [focused]
  );

  return (
    <Container flex={1} alignItems="center">
      <Container
        height={layouts.tabIndicatorDash.height}
        width={layouts.tabIndicatorDash.width}
        backgroundColor={styles.tabIndicatorColor}
        marginBottom={2}
      />
      <Icon
        name={iconName}
        color={styles.iconLabelColor}
        size={layouts.iconSize}
      />
      <Text
        color={styles.iconLabelColor}
        paddingTop={2}
        fontWeight="bold"
        fontSize={10}
      >
        {label}
      </Text>
    </Container>
  );
};

export default memo(TabBarIcon);
