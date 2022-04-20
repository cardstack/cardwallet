// import { useNavigation } from '@react-navigation/core';
import React, { memo } from 'react';

import {
  Button,
  Container,
  ContainerProps,
  CenteredContainer,
  Icon,
  IconName,
  Text,
  Touchable,
} from '@cardstack/components';

interface CtaBannerProps extends ContainerProps {
  title: string;
  description: string;
  ctaButtonTitle: string;
  ctaButtonIconName?: IconName;
  onCtaPressed: () => void;
  onDismissPressed?: () => void;
}

export const CtaBanner = memo(
  ({
    title,
    description,
    ctaButtonTitle,
    ctaButtonIconName,
    onCtaPressed,
    onDismissPressed,
    ...rest
  }: CtaBannerProps) => (
    <Container backgroundColor="black" {...rest}>
      <CenteredContainer padding={6}>
        <Text variant="bannerTitle" color="bannerText" paddingBottom={2}>
          {title}
        </Text>
        <Text
          variant="bannerDescription"
          color="bannerText"
          textAlign="center"
          paddingBottom={4}
        >
          {description}
        </Text>
        {!!onCtaPressed && (
          <Button
            iconProps={ctaButtonIconName && { name: ctaButtonIconName }}
            iconPosition="right"
            onPress={onCtaPressed}
            variant="short"
          >
            <Text fontSize={13} fontWeight="600">
              {ctaButtonTitle}
            </Text>
          </Button>
        )}
      </CenteredContainer>

      {!!onDismissPressed && (
        <Touchable
          onPress={onDismissPressed}
          position="absolute"
          right={0}
          padding={4}
        >
          <Icon name="x" color="bannerText" size={16} />
        </Touchable>
      )}
    </Container>
  )
);
