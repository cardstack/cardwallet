import React from 'react';
import CoinIcon from 'react-coin-icon';

import { CoinItem } from '../../types';
import { CenteredContainer } from '../Container';
import { Container, Icon, Text, Touchable } from '@cardstack/components';

interface BalanceCoinRowProps {
  item: CoinItem;
  onPress: () => void;
  isEditing?: boolean;
  selected: boolean;
}

const SELECT_ICON_WIDTH = '13%';
const EDITING_COIN_ROW_WIDTH = '87%';

export const BalanceCoinRow = ({
  item,
  onPress,
  isEditing,
  selected,
}: BalanceCoinRowProps) => {
  const showIcon = item.isPinned || item.isHidden;
  const iconName = item.isPinned ? 'pin' : 'eye-off';
  const editingIconName = selected ? 'check-circle' : 'circle';

  return (
    <Touchable onPress={onPress}>
      <Container
        alignItems="center"
        width="100%"
        paddingHorizontal={5}
        paddingVertical={2}
        flexDirection="row"
      >
        {isEditing && (
          <Container
            testID={`coin-row-editing-icon-${editingIconName}`}
            width={SELECT_ICON_WIDTH}
          >
            <Icon name={editingIconName} iconSize="medium" />
          </Container>
        )}
        {isEditing && showIcon && (
          <Container
            height="100%"
            justifyContent="center"
            left="14%"
            position="absolute"
            top="12%"
            width={50}
            zIndex={5}
            testID={`coin-row-icon-${iconName}`}
          >
            <CenteredContainer
              width={28}
              height={28}
              borderRadius={100}
              backgroundColor="black"
            >
              <Icon size={20} name={iconName} />
            </CenteredContainer>
          </Container>
        )}
        <Container
          backgroundColor="white"
          borderRadius={10}
          padding={4}
          width={isEditing ? EDITING_COIN_ROW_WIDTH : '100%'}
          zIndex={1}
        >
          <Container
            width="100%"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Container flexDirection="row">
              <CoinIcon size={40} {...item} />
              <Container marginLeft={4}>
                <Text fontWeight="700">{item.name}</Text>
                <Text variant="subText">{item.balance.display}</Text>
              </Container>
            </Container>
            <Container alignItems="flex-end">
              <Text fontWeight="700">{`${item.native.balance.display} USD`}</Text>
              <Text
                variant="subText"
                color={
                  item.price.relative_change_24h > 0 ? 'green' : 'blueText'
                }
              >
                {item.native.change}
              </Text>
            </Container>
          </Container>
        </Container>
        {isEditing && item.isHidden && (
          <Container
            backgroundColor="black"
            top={8}
            bottom={0}
            right={20}
            borderRadius={10}
            opacity={0.5}
            position="absolute"
            height="100%"
            width={EDITING_COIN_ROW_WIDTH}
            zIndex={1}
            testID="coin-row-hidden-overlay"
          />
        )}
      </Container>
    </Touchable>
  );
};
