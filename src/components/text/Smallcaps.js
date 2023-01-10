import styled from 'styled-components';

import colors from '@rainbow-me/styles/colors';

import Text from './Text';

const Smallcaps = styled(Text).attrs(() => ({
  color: colors.alpha(colors.blueGreyDark, 0.8),
  size: 'small',
  uppercase: true,
  weight: 'semibold',
}))``;

export default Smallcaps;
