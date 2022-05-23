import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';
import { useTheme } from './src/context/ThemeContext';
import magicMemo from '@rainbow-me/utils/magicMemo';

export default {
  android: Platform.OS === 'android',
  ios: Platform.OS === 'ios',
  magicMemo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTheme,
};
