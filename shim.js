import 'react-native-get-random-values';
import '@ethersproject/shims';
<<<<<<< HEAD
=======
import AsyncStorage from '@react-native-async-storage/async-storage';
>>>>>>> df41b9939 (Update @react-native-community/async-storage to @react-native-async-storage/async-storage)
import { enableES5 } from 'immer';
import { Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import './src/initializers/conversion-globals';
import './src/initializers/screen-dismissal';
import './src/initializers/shim-renamimated-module-proxy';
// shimming for reanimated need to happen before setting up globals
import './src/initializers/setup-globals';
import './src/initializers/storage';
import './src/initializers/shorten-prop-types-error';
import './src/initializers/layout-animation-logging';
import './src/initializers/interaction-manager-logging';
import './src/initializers/shim-require-native-component';

// Can remove when we update hermes after they enable Proxy support
Platform.OS === 'android' && enableES5();

Platform.OS === 'ios' && Animated.addWhitelistedNativeProps({ d: true });
