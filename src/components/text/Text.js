import PropTypes from 'prop-types';
import { Text as RNText } from 'react-native';
import styled from 'styled-components';

import { buildTextStyles } from '@rainbow-me/styles';

const Text = styled(RNText).attrs({ allowFontScaling: false })`
  ${buildTextStyles};
`;

Text.propTypes = {
  align: PropTypes.oneOf(['auto', 'center', 'left', 'justify', 'right']),
  color: PropTypes.string,
  family: PropTypes.string,
  isEmoji: PropTypes.bool,
  letterSpacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lineHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  mono: PropTypes.bool,
  opacity: PropTypes.number,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  uppercase: PropTypes.bool,
  weight: PropTypes.string,
};

export default Text;
