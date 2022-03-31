import { ResponsiveValue } from '@shopify/restyle';
import React from 'react';
import { strings } from './strings';
import { Container, Text } from '@cardstack/components';
import { Theme } from '@cardstack/theme';
import { dateFormatter } from '@cardstack/utils';
import { ContactAvatar } from '@rainbow-me/components/contacts';

export interface PaymentDetailsItemProps {
  title: string;
  color?: string;
  textColor?: string;
  info: any;
  infoColor?: ResponsiveValue<keyof Theme['colors'], Theme>;
  name?: string;
  isTimestamp?: boolean;
  isPrepaidCard?: boolean;
}

export const PaymentDetailsItem = ({
  title,
  color,
  textColor,
  name,
  info,
  infoColor = 'blueText',
  isTimestamp = false,
  isPrepaidCard = false,
}: PaymentDetailsItemProps) => {
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
                {strings.business.toUpperCase()}
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
              {strings.prepaidCard.toUpperCase()}
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
