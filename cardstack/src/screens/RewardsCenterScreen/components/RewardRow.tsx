import React from 'react';

import {
  Container,
  Button,
  Text,
  CoinIcon,
  TouchableProps,
  CardPressable,
} from '@cardstack/components';

import { strings } from '../strings';

type TxStatus = 'claimed' | 'withdrawn' | 'none';

export interface RewardRowProps extends Omit<TouchableProps, 'children'> {
  coinSymbol: string;
  primaryText: string;
  isClaimable?: boolean;
  subText?: string;
  extraInfoText?: string;
  onClaimPress?: () => void;
  isLoading?: boolean;
  showWithdrawBtn?: boolean;
  txStatus?: TxStatus;
}

export const RewardRow = ({
  coinSymbol,
  primaryText,
  subText,
  extraInfoText,
  txStatus = 'none',
  onClaimPress,
  onPress,
  isLoading = false,
  showWithdrawBtn = false,
  ...props
}: RewardRowProps) => (
  <CardPressable
    flexDirection="column"
    width="100%"
    disabled={!onPress}
    onPress={onPress}
    {...props}
  >
    <Container
      padding={4}
      borderWidth={1}
      borderColor="borderLightColor"
      borderRadius={10}
    >
      <Container alignItems="center" flexDirection="row">
        <CoinIcon size={40} symbol={coinSymbol} />
        <Container
          paddingLeft={3}
          flexDirection="column"
          alignItems="flex-start"
          flex={1}
        >
          <Text fontSize={15}>
            {strings.transaction[txStatus]}
            <Text weight="extraBold" fontSize={15} ellipsizeMode="tail">
              {primaryText}
            </Text>
          </Text>
          {subText && <Text variant="subText">{subText}</Text>}
          {extraInfoText && (
            <Text paddingTop={2} variant="subText">
              {extraInfoText}
            </Text>
          )}
        </Container>
        {
          // Press is disabled bc whole row is clickable
          showWithdrawBtn && (
            <Button variant="tiny" disablePress>
              {strings.withdraw.button}
            </Button>
          )
        }
      </Container>
      {!!onClaimPress && (
        <Container paddingTop={4}>
          <Button
            variant="small"
            height={30}
            width="100%"
            onPress={onClaimPress}
            loading={isLoading}
          >
            {strings.claim.button}
          </Button>
        </Container>
      )}
    </Container>
  </CardPressable>
);
