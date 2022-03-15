import React from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { ScrollView, ScrollViewProps } from '@cardstack/components';
import { Device, screenHeight } from '@cardstack/utils';

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
    flexGrow: 1,
  },
  scrollViewContentStyle: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
});

// ToDo: need to define header height as a global const or hook to be consistent all over the places inside project
const HeaderHeight = screenHeight * 0.07;
const TabBarHeightSize = screenHeight * 0.1;
const KeyboardOffset = TabBarHeightSize + HeaderHeight;

interface CustomScrollViewProps extends ScrollViewProps {
  keyboardEnabled?: boolean;
}

export const CustomScrollViewWrapper = ({
  children: childElements,
  keyboardEnabled,
}: CustomScrollViewProps) =>
  keyboardEnabled ? (
    <KeyboardAvoidingView
      behavior={Device.keyboardBehavior}
      style={styles.keyboardAvoidView}
      keyboardVerticalOffset={KeyboardOffset}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContentStyle}>
        {childElements}
      </ScrollView>
    </KeyboardAvoidingView>
  ) : (
    <ScrollView flex={1} contentContainerStyle={styles.scrollViewContentStyle}>
      {childElements}
    </ScrollView>
  );
