import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import styled from 'styled-components';
import Centered from './Centered';

const Container = styled(View)`
  height: 100%;
  width: 100%;
`;

export default function KeyboardFixedOpenLayout({ ...props }) {
  return (
    <Container>
      <KeyboardAvoidingView behavior="padding">
        <Centered {...props} />
      </KeyboardAvoidingView>
    </Container>
  );
}
