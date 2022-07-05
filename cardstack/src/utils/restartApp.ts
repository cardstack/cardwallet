import RNBootSplash from 'react-native-bootsplash';
import RNRestart from 'react-native-restart';

/**
 * Shows the SplashScreen while restarting the app.
 */
export const restartApp = () => {
  RNRestart.Restart();
  RNBootSplash.show();
};
