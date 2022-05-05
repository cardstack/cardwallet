import React, { useCallback, useState } from 'react';

import {
  CardPressable,
  Container,
  Icon,
  ScrollView,
} from '@cardstack/components';
import { delayLongPressMs } from '@cardstack/constants';
import { useSpendToNativeDisplay } from '@cardstack/hooks';

import { Alert } from '@rainbow-me/components/alerts';
import {
  PinnedHiddenSectionOption,
  useAccountSettings,
  usePinnedAndHiddenItemOptions,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

import { PrepaidCardCustomization, PrepaidCardType } from '../../types';
import { CenteredContainer, ContainerProps } from '../Container';

import { CustomizableBackground } from './components/CustomizableBackground';
import PrepaidCardInnerBottom from './components/PrepaidCardInnerBottom';
import PrepaidCardInnerTop from './components/PrepaidCardInnerTop';

export interface PrepaidCardProps extends PrepaidCardType, ContainerProps {
  networkName: string;
  disabled?: boolean;
  cardCustomization?: PrepaidCardCustomization;
}

const SELECT_ICON_WIDTH = '13%';
const EDITING_COIN_ROW_WIDTH = '87%';

/**
 * A prepaid card component
 */
export const PrepaidCard = (props: PrepaidCardProps) => {
  const [isScrollable] = useState(false);
  const Wrapper = isScrollable ? ScrollView : Container;
  const { networkName, ...prepaidCard } = props;
  const { navigate } = useNavigation();

  const { nativeCurrencyInfo } = useAccountSettings();

  const {
    editing,
    selected,
    pinned,
    hidden,
    select,
    deselect,
  } = usePinnedAndHiddenItemOptions();

  const isEditing = editing === PinnedHiddenSectionOption.PREPAID_CARDS;
  const isHidden = hidden.includes(prepaidCard.address);

  const isSelected = selected.includes(prepaidCard.address);
  const isPinned = pinned.includes(prepaidCard.address);
  const showIcon = isPinned || isHidden;
  const iconName = isHidden ? 'eye-off' : 'pin';
  const iconFamily = isHidden ? 'Feather' : 'MaterialCommunity';
  const editingIconName = isSelected ? 'check-circle' : 'circle';

  const { nativeBalanceDisplay } = useSpendToNativeDisplay({
    spendAmount: prepaidCard.spendFaceValue,
  });

  const onPress = useCallback(() => {
    if (!isEditing) {
      navigate(Routes.PREPAID_CARD_MODAL, {
        prepaidCardProps: props,
      });

      return;
    }

    if (isSelected) {
      deselect(prepaidCard.address);
    } else {
      select(prepaidCard.address);
    }
  }, [
    deselect,
    isEditing,
    isSelected,
    navigate,
    prepaidCard.address,
    props,
    select,
  ]);

  const onLongPress = useCallback(() => {
    if (props.transferrable) {
      navigate(Routes.TRANSFER_CARD, {
        prepaidCardAddress: props.address,
      });

      return;
    }

    Alert({ title: 'Oops!', message: 'Prepaid card not transferrable.' });
  }, [navigate, props.address, props.transferrable]);

  if (!isEditing && isHidden) {
    return null;
  }

  return (
    <Wrapper width="100%" paddingHorizontal={4} marginBottom={4} {...props}>
      <CardPressable
        width="100%"
        testID="prepaid-card"
        alignItems="center"
        flexDirection="row"
        disabled={props.disabled}
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={delayLongPressMs}
      >
        {isEditing && (
          <Container
            testID={`coin-row-editing-icon-${editingIconName}`}
            width={SELECT_ICON_WIDTH}
          >
            <Icon
              name={editingIconName}
              iconSize="medium"
              iconFamily={iconFamily}
              color={isSelected ? 'teal' : null}
            />
          </Container>
        )}
        {isEditing && showIcon && (
          <Container
            height="100%"
            justifyContent="center"
            left="9%"
            position="absolute"
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
              <Icon
                size={16}
                color="teal"
                name={iconName}
                iconFamily={iconFamily}
              />
            </CenteredContainer>
          </Container>
        )}
        <Container
          backgroundColor="white"
          borderRadius={20}
          overflow="hidden"
          width={isEditing ? EDITING_COIN_ROW_WIDTH : '100%'}
        >
          <CustomizableBackground
            cardCustomization={prepaidCard.cardCustomization}
            isEditing={isEditing}
            address={prepaidCard.address}
          />
          <PrepaidCardInnerTop
            address={prepaidCard.address}
            cardCustomization={prepaidCard.cardCustomization}
            networkName={networkName}
          />
          <PrepaidCardInnerBottom
            {...props}
            nativeCurrencyInfo={nativeCurrencyInfo}
            nativeBalance={nativeBalanceDisplay}
          />
        </Container>
        {isEditing && isHidden && (
          <Container
            backgroundColor="black"
            top={0}
            bottom={0}
            right={0}
            borderRadius={20}
            opacity={0.5}
            position="absolute"
            height="100%"
            width={EDITING_COIN_ROW_WIDTH}
            zIndex={1}
            testID="coin-row-hidden-overlay"
          />
        )}
      </CardPressable>
    </Wrapper>
  );
};
