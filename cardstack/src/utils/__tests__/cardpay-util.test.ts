import {
  PrepaidCardCustomization,
  PrepaidLinearGradientInfo,
} from '@cardstack/types';
import {
  isLayer1,
  isLayer2,
  isMainnet,
  parseLinearGradient,
} from '@cardstack/utils/cardpay-utils';

import { Network, networkTypes } from '@rainbow-me/helpers/networkTypes';

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

const layer2Cases = [
  Network.gnosis,
  networkTypes.gnosis,
  Network.sokol,
  'sokol',
  networkTypes.sokol,
];

const layer1Cases = [
  'mainnet',
  Network.mainnet,
  networkTypes.mainnet,
  networkTypes.kovan,
  Network.kovan,
  'kovan',
];

const mainnetCases = [
  'mainnet',
  Network.mainnet,
  networkTypes.mainnet,
  Network.gnosis,
  networkTypes.gnosis,
];

const testeNetCases = [
  'sokol',
  Network.sokol,
  networkTypes.sokol,
  'kovan',
  Network.kovan,
  networkTypes.kovan,
];

describe('Network utils', () => {
  test.each(layer2Cases)(
    'given %p as network, returns true for Layer2',
    network => {
      expect(isLayer2(network as Network)).toBeTruthy();
    }
  );

  test.each(layer2Cases)(
    'given %p as network, returns false for Layer1',
    network => {
      expect(isLayer1(network as Network)).toBeFalsy();
    }
  );

  test.each(layer1Cases)(
    'given %p as network, returns true for Layer1',
    network => {
      expect(isLayer1(network as Network)).toBeTruthy();
    }
  );

  test.each(layer1Cases)(
    'given %p as network, returns false for Layer2',
    network => {
      expect(isLayer2(network as Network)).toBeFalsy();
    }
  );

  test.each(mainnetCases)(
    'given %p as network, returns true for mainnet',
    network => {
      expect(isMainnet(network as Network)).toBeTruthy();
    }
  );

  test.each(testeNetCases)(
    'given %p as network, returns false for mainnet',
    network => {
      expect(isMainnet(network as Network)).toBeFalsy();
    }
  );
});
