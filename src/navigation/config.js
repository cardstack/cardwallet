import React from 'react';
import { Keyboard } from 'react-native';
import styled from 'styled-components';
import BackButton from '../components/header/BackButton';
import { Icon } from '../components/icons';
import { SheetHandleFixedToTopHeight } from '../components/sheet';
import { Text } from '../components/text';
import { useTheme } from '../context/ThemeContext';
import colors from '../context/currentColors';
import { onWillPop } from './Navigation';
import { colors as cardstackColors } from '@cardstack/theme';
import WalletBackupStepTypes from '@rainbow-me/helpers/walletBackupStepTypes';
import { fonts } from '@rainbow-me/styles';
import { deviceUtils, safeAreaInsetValues } from '@rainbow-me/utils';

export const sharedCoolModalTopOffset = safeAreaInsetValues.top + 5;

const buildCoolModalConfig = params => ({
  allowsDragToDismiss: true,
  allowsTapToDismiss: true,
  backgroundOpacity: 0.7,
  blocksBackgroundTouches: true,
  cornerRadius: params.longFormHeight ? 39 : 30,
  customStack: true,
  gestureEnabled: true,
  headerHeight: params.headerHeight || 25,
  ignoreBottomOffset: true,
  isShortFormEnabled: params.isShortFormEnabled,
  longFormHeight: params.longFormHeight,
  onAppear: params.onAppear || null,
  scrollEnabled: params.scrollEnabled,
  single: params.single,
  topOffset: params.topOffset || sharedCoolModalTopOffset,
});

const backupSheetSizes = {
  long:
    deviceUtils.dimensions.height +
    safeAreaInsetValues.bottom +
    sharedCoolModalTopOffset +
    SheetHandleFixedToTopHeight,
  short: 394,
};

export const backupSheetConfig = {
  options: ({ navigation, route }) => {
    const { params: { longFormHeight, step, ...params } = {} } = route;

    let heightForStep = backupSheetSizes.short;
    if (
      step === WalletBackupStepTypes.cloud ||
      step === WalletBackupStepTypes.manual
    ) {
      heightForStep = backupSheetSizes.long;
    } else if (
      // on the "existing_user" step, our "description" text is 1 extra line of text
      // vertically, so we want to increase the sheet height by 1 lineHeight here
      step === WalletBackupStepTypes.existing_user
    ) {
      // TODO: measure this text programatically
      heightForStep = backupSheetSizes.short + fonts.lineHeight.looser;
    }

    if (longFormHeight !== heightForStep) {
      navigation.setParams({
        longFormHeight: heightForStep,
      });
    }

    return buildCoolModalConfig({
      ...params,
      longFormHeight: heightForStep,
    });
  },
};

export const expandedAssetSheetConfig = {
  options: ({ route: { params = {} } }) => ({
    ...buildCoolModalConfig({
      ...params,
      scrollEnabled: true,
    }),
  }),
};

const restoreSheetSizes = {
  ...backupSheetSizes,
  medium: 505,
  short: 363,
};

export const restoreSheetConfig = {
  options: ({ navigation, route }) => {
    const {
      params: {
        longFormHeight,
        step = WalletBackupStepTypes.first,
        ...params
      } = {},
    } = route;

    let heightForStep = restoreSheetSizes.short;
    if (step === WalletBackupStepTypes.cloud) {
      heightForStep = restoreSheetSizes.long;
    }

    if (longFormHeight !== heightForStep) {
      navigation.setParams({
        longFormHeight: heightForStep,
      });
    }

    return buildCoolModalConfig({
      ...params,
      backgroundColor: colors.themedColors.dark,
      longFormHeight: heightForStep,
    });
  },
};

export const savingsSheetConfig = {
  options: ({ route: { params = {} } }) => ({
    ...buildCoolModalConfig({
      ...params,
      headerHeight: 0,
      topOffset: 0,
    }),
  }),
};

export const stackNavigationConfig = {
  headerMode: 'none',
  keyboardHandlingEnabled: ios,
  mode: 'modal',
};

export const defaultScreenStackOptions = {
  animationTypeForReplace: 'pop',
  gestureEnabled: true,
};

export const closeKeyboardOnClose = {
  listeners: {
    transitionEnd: ({ data: { closing } }) => {
      closing && android && Keyboard.dismiss();
    },
  },
};

export const nativeStackDefaultConfig = {
  allowsDragToDismiss: true,
  backgroundColor: colors.themedColors.stackBackground,
  backgroundOpacity: 1,
  customStack: true,
  headerHeight: 0,
  ignoreBottomOffset: true,
  springDamping: 1,
  topOffset: 0,
  transitionDuration: 0.3,
};

// react-native-cool-modals options to display screen as a modal like QRCode Screen
export const nativeStackModalConfig = {
  allowsDragToDismiss: true,
  backgroundColor: cardstackColors.overlayGray,
  backgroundOpacity: 0.95,
  transparentCard: true,
  onAppear: null,
  topOffset: 0,
  ignoreBottomOffset: true,
  cornerRadius: 0,
  customStack: true,
  springDamping: 1,
  transitionDuration: 0.2,
};

export const nativeStackDefaultConfigWithoutStatusBar = {
  ...nativeStackDefaultConfig,
  onWillDismiss: () => {
    onWillPop();
  },
};

export const exchangeTabNavigatorConfig = {
  initialLayout: deviceUtils.dimensions,
  sceneContainerStyle: {
    backgroundColor: 'transparent',
  },
  springConfig: {
    damping: 30,
    mass: 1,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
    stiffness: 300,
  },
  swipeDistanceMinimum: 0,
  swipeVelocityImpact: 1,
  swipeVelocityScale: 1,
  tabBar: () => null,
  transparentCard: true,
};

const transitionConfig = {
  damping: 35,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
  stiffness: 450,
};

const BackArrow = styled(Icon).attrs({
  color: colors.themedColors.appleBlue,
  direction: 'left',
  name: 'caret',
})`
  margin-left: 15;
  margin-right: 5;
  margin-top: ${android ? 2 : 0.5};
`;
const BackImage = () => <BackArrow />;

const headerConfigOptions = {
  headerBackTitleStyle: {
    fontFamily: fonts.family.SFProRounded,
    fontSize: parseFloat(fonts.size.large),
    fontWeight: fonts.weight.medium,
    letterSpacing: fonts.letterSpacing.roundedMedium,
  },
  ...(android && {
    headerRightContainerStyle: {
      paddingTop: 6,
    },
    headerTitleAlign: 'center',
  }),
  headerTitleStyle: {
    color: colors.themedColors.dark,
    fontFamily: fonts.family.SFProRounded,
    fontSize: parseFloat(fonts.size.large),
    fontWeight: fonts.weight.bold,
    letterSpacing: fonts.letterSpacing.roundedMedium,
  },
};

const EmptyButtonPlaceholder = styled.View`
  flex: 1;
`;

const SettingsTitle = ({ children }) => {
  const { colors } = useTheme();

  return (
    <Text
      align="center"
      color={colors.dark}
      letterSpacing="roundedMedium"
      size="large"
      weight="bold"
    >
      {children}
    </Text>
  );
};

export const wyreWebviewOptions = colors => ({
  ...headerConfigOptions,
  // eslint-disable-next-line react/display-name
  headerLeft: props => <BackButton {...props} textChevron />,
  headerStatusBarHeight: 24,
  headerStyle: {
    backgroundColor: colors.white,
    elevation: 24,
    shadowColor: 'transparent',
  },
  headerTitleStyle: {
    ...headerConfigOptions.headerTitleStyle,
    color: colors.dark,
  },
  title: 'Add Cash',
});

export const settingsOptions = colors => ({
  ...headerConfigOptions,
  cardShadowEnabled: false,
  cardStyle: {
    backgroundColor: colors.white,
    overflow: 'visible',
  },
  gestureEnabled: true,
  gestureResponseDistance: { horizontal: deviceUtils.dimensions.width },
  ...(ios && { headerBackImage: BackImage }),
  headerStatusBarHeight: 0,
  headerStyle: {
    backgroundColor: 'transparent',
    elevation: 0,
    height: 49,
    shadowColor: 'transparent',
  },
  headerTitleStyle: {
    ...headerConfigOptions.headerTitleStyle,
    color: colors.dark,
  },
  // eslint-disable-next-line react/display-name
  headerLeft: props => (
    <BackButton color="settingsTeal" left={-10} {...props} />
  ),
  transitionSpec: {
    close: {
      animation: 'spring',
      config: transitionConfig,
    },
    open: {
      animation: 'spring',
      config: transitionConfig,
    },
  },
  ...(android && {
    // eslint-disable-next-line react/display-name
    headerLeft: props => <BackButton {...props} textChevron />,
    // eslint-disable-next-line react/display-name
    headerRight: () => <EmptyButtonPlaceholder />,
    // eslint-disable-next-line react/display-name
    headerTitle: props => <SettingsTitle {...props} />,
  }),
});
