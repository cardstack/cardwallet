import { LayoutAnimation, StyleSheet } from 'react-native';

export const sectionStyle = StyleSheet.create({
  contentContainerStyle: { paddingBottom: 400 },
  sectionList: { width: '100%' },
});

const SMALL = 5;
const MEDIUM = 15;

export const hitSlop = {
  small: {
    top: SMALL,
    bottom: SMALL,
    left: SMALL,
    right: SMALL,
  },
  medium: {
    top: MEDIUM,
    bottom: MEDIUM,
    left: MEDIUM,
    right: MEDIUM,
  },
};

export const layoutEasingAnimation = () => {
  LayoutAnimation.configureNext(
    LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
  );
};
