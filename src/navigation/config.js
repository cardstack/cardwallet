import React from 'react';
import styled from 'styled-components';
import BackButton from '../components/header/BackButton';
import { Icon } from '../components/icons';
import { Text } from '../components/text';
import { useTheme } from '../context/ThemeContext';
import colors from '../context/currentColors';
import { fonts } from '@rainbow-me/styles';
import { deviceUtils } from '@rainbow-me/utils';

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
  gestureResponseDistance: deviceUtils.dimensions.width,
  gestureDirection: 'horizontal',
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
