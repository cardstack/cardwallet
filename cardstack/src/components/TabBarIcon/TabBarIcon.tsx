import React, { memo, useMemo } from 'react';

import { Text, Icon, IconName, Container } from '@cardstack/components';
import { ColorTypes } from '@cardstack/theme';
import { screenWidth } from '@cardstack/utils';

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
    <Container
      flex={1}
      width="100%"
      minWidth={layouts.tabIndicatorDash.width}
      alignItems="center"
    >
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
      <Text variant="tabBar" color={styles.iconLabelColor} paddingTop={2}>
        {label}
      </Text>
    </Container>
  );
};

export default memo(TabBarIcon);
