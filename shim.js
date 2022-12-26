// Random numbers must be added before ethers shim
import 'react-native-get-random-values';
import '@ethersproject/shims';

import './src/initializers/setup-globals';
import './src/initializers/conversion-globals';
import './src/initializers/storage';
import './src/initializers/shorten-prop-types-error';
