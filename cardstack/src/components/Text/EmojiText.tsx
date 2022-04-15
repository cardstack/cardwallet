import { isString } from 'lodash';
import React from 'react';

import { emojis } from '@rainbow-me/references';

import { Text, TextProps } from './Text';

const emojisMap = new Map<string, string>();
Object.entries(emojis).map(([emoji, { name }]) => {
  emojisMap.set(name, emoji);
});

const normalizeName = (name: string) => {
  if (/:.+:/.test(name)) {
    name = name.slice(1, -1);
  }

  return name;
};

const getEmoji = (name: string) => {
  return isString(name) ? emojisMap.get(normalizeName(name)) : null;
};

export type EmojiTextProps = {
  name: string;
} & TextProps;

export const EmojiText = ({ children, name, ...props }: EmojiTextProps) => {
  return <Text {...props}>{children || getEmoji(name)}</Text>;
};
