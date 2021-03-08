import React, { useEffect, useState } from 'react';
import CoinIcon from 'react-coin-icon';

import { useSelector } from 'react-redux';
import { CoinItem } from '../../types';
import { useCoinListEdited, useCoinListEditOptions } from '@rainbow-me/hooks';
import { Container, Icon, Text, Touchable } from '@cardstack/components';

interface BalanceCoinRowProps {
  item: CoinItem;
}

const SELECT_ICON_WIDTH = '13%';
const EDITING_COIN_ROW_WIDTH = '87%';

export const BalanceCoinRow = ({ item }: BalanceCoinRowProps) => {
  const recentlyPinnedCount = useSelector(
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    state => state.editOptions.recentlyPinnedCount
  );

  const [toggle, setToggle] = useState(false);
  const [previousPinned, setPreviousPinned] = useState(0);
  const { isCoinListEdited } = useCoinListEdited();
  const { removeSelectedCoin, pushSelectedCoin } = useCoinListEditOptions();
  const showIcon = item.isPinned || item.isHidden;
  const iconName = item.isPinned ? 'pinned' : 'hidden';

  useEffect(() => {
    if (toggle && (recentlyPinnedCount > previousPinned || !isCoinListEdited)) {
      setPreviousPinned(recentlyPinnedCount);
      setToggle(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCoinListEdited, recentlyPinnedCount]);

  const onPressPin = () => {
    if (toggle) {
      removeSelectedCoin(item.uniqueId);
    } else {
      pushSelectedCoin(item.uniqueId);
    }

    setToggle(!toggle);
  };

  const Wrapper = isCoinListEdited ? Touchable : Container;

  return (
    <Wrapper onPress={onPressPin}>
      <Container
        alignItems="center"
        width="100%"
        paddingHorizontal={5}
        paddingVertical={2}
        flexDirection="row"
      >
        {isCoinListEdited && (
          <Container width={SELECT_ICON_WIDTH}>
            <Icon name={toggle ? 'check-circle' : 'circle'} iconSize="medium" />
          </Container>
        )}
        {showIcon && isCoinListEdited && (
          <Container
            position="absolute"
            left={SELECT_ICON_WIDTH}
            top="15%"
            height="100%"
            justifyContent="center"
            width={50}
            zIndex={5}
          >
            <Icon name={iconName} iconSize="xl" />
          </Container>
        )}
        <Container
          backgroundColor="white"
          borderRadius={10}
          padding={4}
          width={isCoinListEdited ? EDITING_COIN_ROW_WIDTH : '100%'}
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
        {isCoinListEdited && item.isHidden && (
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
          />
        )}
      </Container>
    </Wrapper>
  );
};
