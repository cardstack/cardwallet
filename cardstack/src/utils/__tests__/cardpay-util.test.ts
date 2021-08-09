import { parseLinearGradient } from '../cardpay-utils';
import {
  PrepaidCardCustomization,
  PrepaidLinearGradientInfo,
} from '@cardstack/types';

it('parseLinearGradient with 2 stop linear gradient', () => {
  const cardCustomization: PrepaidCardCustomization = {
    background: 'linear-gradient(139.27deg, #FFFFAA 16%, #B7FFFC 100%)',
    issuerName: 'MyPrepaidCard1',
    patternColor: 'white',
    patternUrl: null,
    textColor: 'black',
  };

  const parsedGradientResult: PrepaidLinearGradientInfo = {
    angle: 40.73,
    hasGradient: true,
    stop1: { offset: '16%', stopColor: '#FFFFAA' },
    stop2: { offset: '100%', stopColor: '#B7FFFC' },
  };

  const result = parseLinearGradient(cardCustomization);
  expect(result).toBe(parsedGradientResult);
});

it('parseLinearGradient with no gradient', () => {
  const cardCustomization: PrepaidCardCustomization = {
    background: '#FFD800',
    issuerName: 'MyPrepaidCard2',
    patternColor: 'white',
    patternUrl: null,
    textColor: 'black',
  };

  const parsedGradientResult: PrepaidLinearGradientInfo = {
    angle: undefined,
    hasGradient: false,
    stop1: undefined,
    stop2: undefined,
  };

  const result = parseLinearGradient(cardCustomization);
  expect(result).toBe(parsedGradientResult);
});
