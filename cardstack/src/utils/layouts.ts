import { LayoutAnimation, StyleSheet } from 'react-native';

export const sectionStyle = StyleSheet.create({
  contentContainerStyle: { paddingBottom: 400 },
  sectionList: { width: '100%' },
});

const SMALL = 5;
const MEDIUM = 15;

const hitSlopBuilder = (size: number) =>
  ['top', 'bottom', 'left', 'right'].reduce(
    (acc, value) => ({ ...acc, [value]: size }),
    {}
  );

export const hitSlop = {
  small: hitSlopBuilder(SMALL),
  medium: hitSlopBuilder(MEDIUM),
};

export const layoutEasingAnimation = () => {
  LayoutAnimation.configureNext(
    LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
  );
};
