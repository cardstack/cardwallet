import React, { memo, ReactNode } from 'react';

import {
  Container,
  Text,
  Icon,
  HorizontalDivider,
  Touchable,
  IconProps,
} from '@cardstack/components';

import { ListItemArrowGroup } from '@rainbow-me/components/list';

interface ItemProps {
  label: string;
  iconProps?: IconProps;
  customRightItem?: ReactNode;
  onPress?: () => void;
  showDivider?: boolean;
}

const Item = ({
  label,
  iconProps,
  customRightItem,
  onPress,
  showDivider = true,
}: ItemProps) => (
  <>
    <Touchable
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      disabled={!onPress}
      onPress={onPress}
    >
      <Container flexDirection="row" alignItems="center">
        {iconProps && (
          <Icon
            iconSize="medium"
            marginRight={3}
            color="settingsTeal"
            {...iconProps}
          />
        )}
        <Text variant="body" weight="semibold">
          {label}
        </Text>
      </Container>
      {customRightItem || <ListItemArrowGroup />}
    </Touchable>
    {showDivider && <HorizontalDivider />}
  </>
);

export default memo(Item);
