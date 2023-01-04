import styled from 'styled-components';
import { TruncatedText } from '../text';
import { Device } from '@cardstack/utils';
import colors from '@rainbow-me/styles/colors';

const CoinName = styled(TruncatedText).attrs(({ color }) => ({
  color: color || colors.dark,
  letterSpacing: 'roundedMedium',
  lineHeight: Device.isAndroid ? 'normalTight' : 'normal',
  size: 'lmedium',
}))`
  padding-right: ${({ paddingRight = 19 }) => paddingRight};
`;

export default CoinName;
