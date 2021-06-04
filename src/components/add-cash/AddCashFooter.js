import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { useDimensions } from '../../hooks';
import { useNavigation } from '../../navigation/Navigation';
import { ButtonPressAnimation } from '../animations';
import ApplePayButton from './ApplePayButton';
import {
  CenteredContainer,
  Container,
  Icon,
  Text,
} from '@cardstack/components';
import Routes from '@rainbow-me/routes';

const AddCashFooter = ({ disabled, onDisabledPress, onSubmit, ...props }) => {
  const { isTallPhone, isTinyPhone } = useDimensions();
  const { navigate } = useNavigation();
  const onSupportedGeoPress = useCallback(() => {
    navigate(Routes.SUPPORTED_COUNTRIES_MODAL_SCREEN, {
      type: 'supported_countries',
    });
  }, [navigate]);

  return (
    <Container
      alignItems="center"
      paddingBottom={4}
      paddingHorizontal={4}
      width="100%"
      {...props}
    >
      <Container flexDirection="row" width="100%">
        <ApplePayButton
          disabled={disabled}
          onDisabledPress={onDisabledPress}
          onSubmit={onSubmit}
        />
      </Container>
      {!isTinyPhone && (
        <ButtonPressAnimation
          onPress={onSupportedGeoPress}
          paddingBottom={isTallPhone ? 10 : 15}
          paddingHorizontal={10}
          scaleTo={0.96}
        >
          <Container alignItems="center" flexDirection="row" margin={2}>
            <Text color="blueText">Works with most debit cards</Text>
            <CenteredContainer marginLeft={2}>
              <Icon color="blueText" name="question-square" />
            </CenteredContainer>
          </Container>
        </ButtonPressAnimation>
      )}
    </Container>
  );
};

AddCashFooter.propTypes = {
  disabled: PropTypes.bool,
  onDisabledPress: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default React.memo(AddCashFooter);
