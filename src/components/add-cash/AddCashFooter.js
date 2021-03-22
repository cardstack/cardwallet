import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { useTheme } from '../../context/ThemeContext';
import { useDimensions } from '../../hooks';
import { useNavigation } from '../../navigation/Navigation';
import { ButtonPressAnimation } from '../animations';
import { Centered, ColumnWithMargins, Row, RowWithMargins } from '../layout';
import ApplePayButton from './ApplePayButton';
import { Icon, Text } from '@cardstack/components';
import Routes from '@rainbow-me/routes';

const AddCashFooter = ({ disabled, onDisabledPress, onSubmit, ...props }) => {
  const { isTallPhone, isTinyPhone } = useDimensions();
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const onSupportedGeoPress = useCallback(() => {
    navigate(Routes.SUPPORTED_COUNTRIES_MODAL_SCREEN, {
      type: 'supported_countries',
    });
  }, [navigate]);

  return (
    <ColumnWithMargins
      align="center"
      margin={19}
      paddingHorizontal={15}
      width="100%"
      {...props}
    >
      <Row width="100%">
        <ApplePayButton
          disabled={disabled}
          onDisabledPress={onDisabledPress}
          onSubmit={onSubmit}
        />
      </Row>
      {!isTinyPhone && (
        <ButtonPressAnimation
          onPress={onSupportedGeoPress}
          paddingBottom={isTallPhone ? 10 : 15}
          paddingHorizontal={10}
          scaleTo={0.96}
        >
          <RowWithMargins align="center" margin={3}>
            <Text color="blueText">Works with most debit cards</Text>
            <Centered marginLeft={2} marginTop={0.5}>
              <Icon color="blueText" name="question-square" />
            </Centered>
          </RowWithMargins>
        </ButtonPressAnimation>
      )}
    </ColumnWithMargins>
  );
};

AddCashFooter.propTypes = {
  disabled: PropTypes.bool,
  onDisabledPress: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default React.memo(AddCashFooter);
