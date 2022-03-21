import React from 'react';
import { strings } from '../strings';
import {
  Container,
  Button,
  Text,
  CoinIcon,
  ContainerProps,
} from '@cardstack/components';

interface RewardRowProps extends ContainerProps {
  coinSymbol: string;
  primaryText: string;
  subText: string;
  onClaimPress?: () => void;
}

export const RewardRow = ({
  coinSymbol,
  primaryText,
  subText,
  onClaimPress,
  ...props
}: RewardRowProps) => (
  <Container flexDirection="column" width="100%" {...props}>
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
          <Text weight="extraBold" fontSize={15} ellipsizeMode="tail">
            {primaryText}
          </Text>
          {subText && <Text variant="subText">{subText}</Text>}
        </Container>
      </Container>
      {!!onClaimPress && (
        <Container paddingTop={4}>
          <Button
            variant="small"
            height={35}
            width="100%"
            onPress={onClaimPress}
          >
            {strings.claim.button}
          </Button>
        </Container>
      )}
    </Container>
  </Container>
);
