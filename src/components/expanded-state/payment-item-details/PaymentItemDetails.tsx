import { ResponsiveValue } from '@shopify/restyle';
import React from 'react';
import { CoinIcon, Container, Text } from '@cardstack/components';
import { Theme } from '@cardstack/theme';
import { dateFormatter } from '@cardstack/utils';
import { ContactAvatar } from '@rainbow-me/components/contacts';

export interface MerchantPaymentItemDetailProps {
  description: string;
  value?: string;
  subValue?: string;
  symbol?: string;
}

export const MerchantPaymentItemDetail = ({
  description,
  value,
  subValue = '',
  symbol = 'DAI',
}: MerchantPaymentItemDetailProps) => {
  return (
    <Container
      flexDirection="row"
      justifyContent="space-between"
      marginBottom={10}
    >
      <Container flex={1}>
        <Text color="blueText" fontSize={13} fontWeight="600" marginTop={1}>
          {description}
        </Text>
      </Container>
      <Container flex={1} flexDirection="row">
        <Container marginRight={3} marginTop={1}>
          <CoinIcon size={20} symbol={symbol} />
        </Container>
        <Container>
          <Text weight="extraBold">{value}</Text>
          <Text color="blueText" fontSize={13}>
            {subValue}
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

export const PaymentDetailsItem = ({
  title,
  color,
  textColor,
  name,
  info,
  infoColor = 'blueText',
  isTimestamp = false,
  isPrepaidCard = false,
}: {
  title: string;
  color?: string;
  textColor?: string;
  info: any;
  infoColor?: ResponsiveValue<keyof Theme['colors'], Theme>;
  name?: string;
  isTimestamp?: boolean;
  isPrepaidCard?: boolean;
}) => {
  return (
    <Container marginBottom={6} paddingHorizontal={6}>
      <Text color="blueText" marginBottom={2} size="xxs" weight="extraBold">
        {title}
      </Text>
      {name ? (
        <>
          <Container flexDirection="row" marginBottom={1}>
            <Container flex={2} />
            <Container flex={8}>
              <Text color="blueText" size="smallest" weight="bold">
                BUSINESS
              </Text>
            </Container>
          </Container>
          <Container flexDirection="row">
            <Container alignItems="center" flex={2}>
              <ContactAvatar
                color={color}
                size="smaller"
                textColor={textColor}
                value={name}
              />
            </Container>
            <Container flex={8} marginBottom={1}>
              <Text weight="extraBold">{name}</Text>
            </Container>
          </Container>
        </>
      ) : null}
      <Container flexDirection="row" marginBottom={1}>
        <Container flex={2} />
        <Container flex={8}>
          {isPrepaidCard && (
            <Text color={infoColor} size="smallest">
              PREPAID CARD
            </Text>
          )}
          <Text color={infoColor} size="small">
            {isTimestamp ? dateFormatter(info) : info}
          </Text>
        </Container>
      </Container>
    </Container>
  );
};
