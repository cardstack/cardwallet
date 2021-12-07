import { LayoutAnimation } from 'react-native';
import { debugLayoutAnimations } from '../config/debug';
import logger from 'logger';

const oldConfigureNext = LayoutAnimation.configureNext;

if (!LayoutAnimation.configureNext.__shimmed && debugLayoutAnimations) {
  LayoutAnimation.configureNext = (...args) => {
    logger.sentry('LayoutAnimation.configureNext', args);
    oldConfigureNext(...args);
  };
  LayoutAnimation.configureNext.__shimmed = true;
}
