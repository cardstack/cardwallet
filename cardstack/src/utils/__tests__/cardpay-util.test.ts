import {
  NetworkType,
  PrepaidCardCustomization,
  PrepaidLinearGradientInfo,
} from '@cardstack/types';
import {
  isLayer1,
  isCardPayCompatible,
  isMainnet,
  parseLinearGradient,
} from '@cardstack/utils/cardpay-utils';

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
    hasLinearGradient: true,
    stop1: { offset: '16%', stopColor: '#FFFFAA' },
    stop2: { offset: '100%', stopColor: '#B7FFFC' },
  };

  const result = parseLinearGradient(cardCustomization);
  expect(result).toEqual(parsedGradientResult);
});

it('parseLinearGradient with 3 stop linear gradient', () => {
  const cardCustomization: PrepaidCardCustomization = {
    background: 'linear-gradient(139.27deg, #FFFFAA 16%, #B7FFFC 100%)',
    issuerName: 'MyPrepaidCard1',
    patternColor: 'white',
    patternUrl: null,
    textColor: 'black',
  };

  const parsedGradientResult: PrepaidLinearGradientInfo = {
    angle: 40.73,
    hasLinearGradient: true,
    stop1: { offset: '16%', stopColor: '#FFFFAA' },
    stop2: { offset: '100%', stopColor: '#B7FFFC' },
  };

  const result = parseLinearGradient(cardCustomization);
  expect(result).toEqual(parsedGradientResult);
});

it('parseLinearGradient with radial gradient', () => {
  const cardCustomization: PrepaidCardCustomization = {
    background: 'radial-gradient(#e66465, #9198e5)',
    issuerName: 'MyPrepaidCard1',
    patternColor: 'white',
    patternUrl: null,
    textColor: 'black',
  };

  const parsedGradientResult: PrepaidLinearGradientInfo = {
    hasLinearGradient: false,
  };

  const result = parseLinearGradient(cardCustomization);
  expect(result).toEqual(parsedGradientResult);
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
    hasLinearGradient: false,
  };

  const result = parseLinearGradient(cardCustomization);
  expect(result).toEqual(parsedGradientResult);
});

const layer2Cases = [NetworkType.gnosis, NetworkType.sokol, 'sokol'];

const layer1Cases = ['mainnet', NetworkType.mainnet];

const mainnetCases = [
  'mainnet',
  NetworkType.mainnet,
  NetworkType.mainnet,
  NetworkType.gnosis,
  NetworkType.gnosis,
];

const testnetCases = ['sokol', NetworkType.sokol, NetworkType.sokol];

describe('Network utils', () => {
  test.each(layer2Cases)(
    'given %p as network, returns true for Layer2',
    network => {
      expect(isCardPayCompatible(network as NetworkType)).toBeTruthy();
    }
  );

  test.each(layer2Cases)(
    'given %p as network, returns false for Layer1',
    network => {
      expect(isLayer1(network as NetworkType)).toBeFalsy();
    }
  );

  test.each(layer1Cases)(
    'given %p as network, returns true for Layer1',
    network => {
      expect(isLayer1(network as NetworkType)).toBeTruthy();
    }
  );

  test.each(layer1Cases)(
    'given %p as network, returns false for Layer2',
    network => {
      expect(isCardPayCompatible(network as NetworkType)).toBeFalsy();
    }
  );

  test.each(mainnetCases)(
    'given %p as network, returns true for mainnet',
    network => {
      expect(isMainnet(network as NetworkType)).toBeTruthy();
    }
  );

  test.each(testnetCases)(
    'given %p as network, returns false for mainnet',
    network => {
      expect(isMainnet(network as NetworkType)).toBeFalsy();
    }
  );
});
