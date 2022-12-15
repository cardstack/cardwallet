import React from 'react';

import {
  CardPressable,
  CenteredContainer,
  Container,
  Icon,
  NetworkBadge,
  TokenBalance,
} from '@cardstack/components';

import { AssetWithNativeType } from '../../types';

interface BalanceCoinRowProps {
  item: AssetWithNativeType;
  onPress: () => void;
  isEditing?: boolean;
  selected: boolean;
  pinned?: boolean;
  hidden?: boolean;
}

const SELECT_ICON_WIDTH = '13%';
const EDITING_COIN_ROW_WIDTH = '87%';

export const BalanceCoinRow = ({
  item,
  onPress,
  isEditing,
  selected,
  pinned = false,
  hidden = false,
}: BalanceCoinRowProps) => {
  const nativeBalance = parseFloat(item.native.balance.amount)
    ? item.native?.balance?.display
    : '';

  return (
    <Container width="100%" paddingHorizontal={4} marginBottom={2}>
      <CardPressable
        alignItems="center"
        width="100%"
        flexDirection="row"
        onPress={onPress}
      >
        <EditingSelectIcon isEditing={isEditing} selected={selected} />
        <PinnedOrHiddenIcon
          isEditing={isEditing}
          hidden={hidden}
          pinned={pinned}
        />
        <Container
          backgroundColor="white"
          borderRadius={10}
          padding={4}
          width={isEditing ? EDITING_COIN_ROW_WIDTH : '100%'}
          zIndex={1}
        >
          <NetworkBadge marginBottom={4} />
          <TokenBalance
            address={item.address}
            tokenSymbol={item.symbol}
            tokenBalance={item.balance?.display}
            nativeBalance={nativeBalance}
          />
        </Container>
        <HiddenOverlay isEditing={isEditing} hidden={hidden} />
      </CardPressable>
    </Container>
  );
};

const EditingSelectIcon = ({
  isEditing,
  selected,
}: {
  isEditing?: boolean;
  selected?: boolean;
}) => {
  if (!isEditing) {
    return null;
  }

  const editingIconName = selected ? 'check-circle' : 'circle';

  return (
    <Container
      testID={`coin-row-editing-icon-${editingIconName}`}
      width={SELECT_ICON_WIDTH}
    >
      <Icon
        name={editingIconName}
        iconSize="medium"
        iconFamily="Feather"
        color={selected ? 'teal' : null}
      />
    </Container>
  );
};

const PinnedOrHiddenIcon = ({
  isEditing,
  pinned,
  hidden,
}: {
  isEditing?: boolean;
  pinned?: boolean;
  hidden?: boolean;
}) => {
  const showIcon = pinned || hidden;
  const iconName = hidden ? 'eye-off' : 'pin';
  const iconFamily = pinned ? 'MaterialCommunity' : 'Feather';

  if (!isEditing || !showIcon) {
    return null;
  }

  return (
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
        <Icon size={16} color="teal" name={iconName} iconFamily={iconFamily} />
      </CenteredContainer>
    </Container>
  );
};

const HiddenOverlay = ({
  isEditing,
  hidden,
}: {
  isEditing?: boolean;
  hidden: boolean;
}) => {
  if (isEditing && hidden) {
    return (
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
    );
  }

  return null;
};
