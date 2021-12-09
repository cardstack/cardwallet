import { LayoutAnimation, StyleSheet } from 'react-native';

export const sectionStyle = StyleSheet.create({
  contentContainerStyle: { paddingBottom: 400 },
  sectionList: { width: '100%' },
});

export const hitSlop = {
  small: {
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
  },
};

export const layoutEasingAnimation = () => {
  LayoutAnimation.configureNext(
    LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
  );
};
