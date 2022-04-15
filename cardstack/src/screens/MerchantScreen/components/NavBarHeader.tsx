import { useNavigation } from '@react-navigation/core';
import React, { memo, useCallback } from 'react';

import {
  CenteredContainer,
  Container,
  Icon,
  NetworkBadge,
  Text,
  Touchable,
} from '@cardstack/components';
import { getAddressPreview } from '@cardstack/utils';

import Routes from '@rainbow-me/routes';

export const NavBarHeader = memo(
  ({ address, name }: { address: string; name?: string }) => {
    const { goBack, navigate } = useNavigation();

    const onPressInformation = useCallback(() => {
      navigate(Routes.MODAL_SCREEN, {
        address,
        type: 'copy_address',
      });
    }, [address, navigate]);

    return (
      <Container paddingTop={14} backgroundColor="black">
        <Container paddingBottom={6}>
          <CenteredContainer flexDirection="row">
            <Touchable onPress={goBack} left={12} position="absolute">
              <Icon name="chevron-left" color="teal" size={30} />
            </Touchable>
            <Container alignItems="center" width="80%">
              <Text
                color="white"
                weight="bold"
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {name || ''}
              </Text>
              <Container flexDirection="row" alignItems="center">
                <NetworkBadge marginRight={2} />
                <Touchable onPress={onPressInformation}>
                  <Container flexDirection="row" alignItems="center">
                    <Text
                      fontFamily="RobotoMono-Regular"
                      color="white"
                      size="xs"
                      marginRight={2}
                    >
                      {getAddressPreview(address)}
                    </Text>
                    <Icon name="info" size={15} />
                  </Container>
                </Touchable>
              </Container>
            </Container>
          </CenteredContainer>
        </Container>
      </Container>
    );
  }
);
