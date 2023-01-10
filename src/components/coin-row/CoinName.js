import styled from 'styled-components';

import { Device } from '@cardstack/utils';

import colors from '@rainbow-me/styles/colors';

import { TruncatedText } from '../text';

const CoinName = styled(TruncatedText).attrs(({ color }) => ({
  color: color || colors.dark,
  letterSpacing: 'roundedMedium',
  lineHeight: Device.isAndroid ? 'normalTight' : 'normal',
  size: 'lmedium',
}))`
  padding-right: ${({ paddingRight = 19 }) => paddingRight};
`;

export default CoinName;
