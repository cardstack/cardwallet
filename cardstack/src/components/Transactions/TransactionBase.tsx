import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React, { useCallback } from 'react';
import { Linking } from 'react-native';

import {
  CardPressable,
  Container,
  HorizontalDivider,
  Text,
} from '@cardstack/components';
import { NetworkType } from '@cardstack/types';
import { isLayer1, normalizeTxHash, ClaimStatusTypes } from '@cardstack/utils';

import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

import { ContainerProps } from '../Container';
import { Icon, IconName, IconProps } from '../Icon';

export interface TransactionBaseCustomizationProps {
  includeBorder?: boolean;
  prepaidInlineTransaction?: boolean;
  disabled?: boolean;
}

export interface TransactionBaseProps
  extends TransactionBaseCustomizationProps {
  CoinIcon: JSX.Element;
  Footer?: JSX.Element;
  Header?: JSX.Element | null;
  primaryText: string;
  statusIconName: IconName;
  statusIconProps?: IconProps;
  statusText: string;
  statusSubText?: string;
  subText?: string;
  topText?: string;
  transactionHash: string;
  isFullWidth?: boolean;
  onPressTransaction?: (props: TransactionBaseProps) => void;
  recipientName?: string;
}

export const TransactionBase = (props: TransactionBaseProps) => {
  const {
    Footer,
    Header,
    transactionHash,
    includeBorder,
    isFullWidth,
    onPressTransaction,
    disabled,
  } = props;

  const network = useRainbowSelector(
    state => state.settings.network
  ) as NetworkType;

  const blockExplorer = getConstantByNetwork('blockExplorer', network);
  const blockExplorerName = isLayer1(network) ? 'Etherscan' : 'Blockscout';
  const normalizedHash = normalizeTxHash(transactionHash);

  const handleOnPressTransaction = useCallback(() => {
    const onPressBlockscout = () => {
      showActionSheetWithOptions(
        {
          options: [`View on ${blockExplorerName}`, 'Cancel'],
          cancelButtonIndex: 1,
        },
        (buttonIndex: number) => {
          if (buttonIndex === 0) {
            Linking.openURL(`${blockExplorer}/tx/${normalizedHash}`);
          }
        }
      );
    };

    onPressTransaction ? onPressTransaction(props) : onPressBlockscout();
  }, [
    blockExplorer,
    blockExplorerName,
    normalizedHash,
    onPressTransaction,
    props,
  ]);

  return (
    <Container
      width="100%"
      paddingHorizontal={isFullWidth ? 0 : 4}
      marginVertical={2}
    >
      <CardPressable
        testID="inventory-card"
        onPress={handleOnPressTransaction}
        disabled={disabled}
        width="100%"
      >
        <Container
          width="100%"
          paddingBottom={4}
          backgroundColor="white"
          borderWidth={includeBorder ? 1 : 0}
          borderRadius={10}
          overflow="hidden"
          borderColor="borderGray"
        >
          {Header}
          <TransactionRow {...props} />
          {Footer && (
            <>
              <HorizontalDivider />
              {Footer}
            </>
          )}
        </Container>
      </CardPressable>
    </Container>
  );
};

export interface TransactionRowProps extends ContainerProps {
  CoinIcon: JSX.Element;
  primaryText: string;
  statusIconName: IconName;
  statusIconProps?: IconProps;
  statusText: string;
  statusSubText?: string;
  subText?: string;
  topText?: string;
  address?: string;
  hasBottomDivider?: boolean;
  recipientName?: string;
  symbol?: string;
}

export interface Asset extends TransactionRowProps {
  CoinIcon: JSX.Element;
  Header: any;
  includeBorder: boolean;
  index: number;
  isFullWidth: boolean;
  primaryText: string;
  section: Section;
  statusText: string;
  subText: string;
  transactionHash: string;
  claimStatus: ClaimStatusTypes;
  symbol?: string;
}

interface Section {
  data: any[];
  title: string;
}

export const TransactionRow = ({
  CoinIcon,
  statusIconName,
  statusIconProps,
  statusText,
  statusSubText,
  topText,
  primaryText,
  subText,
  hasBottomDivider = false,
  recipientName,
  ...props
}: TransactionRowProps) => {
  return (
    <Container
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal={5}
      paddingTop={recipientName ? 2 : 3}
      {...props}
    >
      <Container flexDirection="column" width="100%">
        <Container
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <Container flexDirection="column">
            {recipientName ? (
              <Container paddingBottom={3}>
                <Text variant="subText" size="xs">
                  {`To ${recipientName}`}
                </Text>
              </Container>
            ) : null}
            <Container flexDirection="row" alignItems="center">
              {CoinIcon}
              <Container marginLeft={4} flexDirection="row" alignItems="center">
                <Container width={20}>
                  <Icon
                    name={statusIconName}
                    size={16}
                    color="blueText"
                    stroke="blueText"
                    {...statusIconProps}
                  />
                </Container>
                <Container flexDirection="column">
                  <Text variant="subText" weight="bold">
                    {statusText}
                  </Text>
                  {statusSubText && (
                    <Text size="smallest" weight="bold">
                      {statusSubText}
                    </Text>
                  )}
                </Container>
              </Container>
            </Container>
          </Container>
          <Container flexDirection="column" alignItems="flex-end" flex={1}>
            {topText && <Text size="small">{topText}</Text>}
            <Container maxWidth="80%">
              <Text weight="extraBold" fontSize={15} ellipsizeMode="tail">
                {primaryText}
              </Text>
            </Container>

            {subText && <Text variant="subText">{subText}</Text>}
          </Container>
        </Container>
        {hasBottomDivider && <HorizontalDivider />}
      </Container>
    </Container>
  );
};
