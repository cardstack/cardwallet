import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React from 'react';
import { Linking } from 'react-native';
import { Icon, IconName, IconProps } from '../Icon';
import { ContainerProps } from '../Container';
import {
  Container,
  HorizontalDivider,
  Text,
  Touchable,
} from '@cardstack/components';
import { isLayer1 } from '@cardstack/utils';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

export interface TransactionBaseProps {
  CoinIcon: JSX.Element;
  Footer?: JSX.Element;
  Header?: JSX.Element;
  primaryText: string;
  statusIconName: IconName;
  statusIconProps?: IconProps;
  statusText: string;
  statusSubText?: string;
  subText?: string;
  topText?: string;
  transactionHash: string;
}

export const TransactionBase = (props: TransactionBaseProps) => {
  const { Footer, Header, transactionHash } = props;

  const network = useRainbowSelector(state => state.settings.network);
  const blockExplorer = getConstantByNetwork('blockExplorer', network);
  const bottomPaddingProp = Footer ? {} : { paddingBottom: 4 };
  const blockExplorerName = isLayer1(network) ? 'Etherscan' : 'Blockscout';

  const onPressTransaction = () => {
    showActionSheetWithOptions(
      {
        options: [`View on ${blockExplorerName}`, 'Cancel'],
        cancelButtonIndex: 1,
      },
      (buttonIndex: number) => {
        if (buttonIndex === 0) {
          Linking.openURL(`${blockExplorer}/tx/${transactionHash}`);
        }
      }
    );
  };

  return (
    <Container width="100%" paddingHorizontal={4} marginVertical={2}>
      <Touchable
        width="100%"
        testID="inventory-card"
        onPress={onPressTransaction}
      >
        <Container
          backgroundColor="white"
          borderRadius={10}
          overflow="hidden"
          borderColor="buttonPrimaryBorder"
          width="100%"
        >
          {Header}
          <TransactionRow {...bottomPaddingProp} {...props} />
          {Footer && (
            <>
              <HorizontalDivider />
              {Footer}
            </>
          )}
        </Container>
      </Touchable>
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
  ...props
}: TransactionRowProps) => {
  return (
    <Container
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal={5}
      paddingTop={4}
      {...props}
    >
      <Container
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
        width="100%"
      >
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
        <Container flexDirection="column" marginLeft={3} alignItems="flex-end">
          {topText && <Text size="small">{topText}</Text>}
          <Text weight="extraBold">{primaryText}</Text>
          {subText && <Text variant="subText">{subText}</Text>}
        </Container>
      </Container>
    </Container>
  );
};
