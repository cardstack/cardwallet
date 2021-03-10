import styled from 'styled-components';
import { TruncatedText } from '../text';

const TokenInfoValue = styled(TruncatedText).attrs(
  ({ weight = 'semibold' }) => ({
    weight,
  })
)``;

export default TokenInfoValue;
