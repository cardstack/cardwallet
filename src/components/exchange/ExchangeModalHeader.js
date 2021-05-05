import React, { useEffect, useRef } from 'react';
import { Transition, Transitioning } from 'react-native-reanimated';
import styled from 'styled-components';
import { usePrevious } from '../../hooks';
import { ButtonPressAnimation } from '../animations';
import { SheetHandle } from '../sheet';
import { Container, Icon, Text } from '@cardstack/components';
import { padding, position } from '@rainbow-me/styles';

const SheetHandleMargin = 3;

const transition = (
  <Transition.Sequence>
    <Transition.Out durationMs={200} interpolation="easeOut" type="fade" />
    <Transition.Change durationMs={200} interpolation="easeInOut" />
    <Transition.Together>
      <Transition.In durationMs={75} interpolation="easeOut" type="fade" />
      <Transition.In durationMs={100} interpolation="easeOut" type="scale" />
    </Transition.Together>
  </Transition.Sequence>
);

const InfoButtonTransition = styled(Transitioning.View)`
  ${position.centered};
  bottom: 0;
  position: absolute;
  right: 0;
  top: 0;
`;

const ExchangeModalHeader = ({
  onPressDetails,
  showDetailsButton,
  testID,
  title = 'Swap',
}) => {
  const transitionRef = useRef();
  const prevShowDetailsButton = usePrevious(showDetailsButton);

  useEffect(() => {
    if (showDetailsButton !== prevShowDetailsButton) {
      transitionRef.current?.animateNextTransition();
    }
  }, [prevShowDetailsButton, showDetailsButton]);

  return (
    <Container alignItems="center" css={padding(6, 0)} testID={testID}>
      <SheetHandle marginBottom={SheetHandleMargin} />
      <Text alignItems="center" color="black" fontWeight="bold" size="medium">
        {title}
      </Text>
      <InfoButtonTransition ref={transitionRef} transition={transition}>
        {showDetailsButton && (
          <ButtonPressAnimation onPress={onPressDetails}>
            <Icon
              alignItems="center"
              justifyContent="center"
              marginHorizontal={4}
              marginTop={SheetHandleMargin}
              name="info-blue"
              size={18}
              testID="swap-info-button"
            />
          </ButtonPressAnimation>
        )}
      </InfoButtonTransition>
    </Container>
  );
};

export default React.memo(ExchangeModalHeader);
