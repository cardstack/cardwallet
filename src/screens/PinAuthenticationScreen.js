import { useNavigation, useRoute } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, Keyboard } from 'react-native';

import { CenteredContainer, Icon, Text } from '@cardstack/components';
import { appName } from '@cardstack/constants';
import { Routes, useDismissCurrentRoute } from '@cardstack/navigation';
import { colors } from '@cardstack/theme';

import { padding } from '@rainbow-me/styles';

import { Centered, Column, ColumnWithMargins } from '../components/layout';
import { Numpad, PinValue } from '../components/numpad';
import {
  getAuthTimelock,
  getPinAuthAttemptsLeft,
  saveAuthTimelock,
  savePinAuthAttemptsLeft,
} from '../handlers/localstorage/globalSettings';
import { useDimensions } from '../hooks';
import { useBlockBackButton } from '../hooks/useBlockBackButton';

const layouts = {
  iconSize: 80,
};

const MAX_ATTEMPTS = 10;
const TIMELOCK_INTERVAL_MINUTES = 5;

const PinAuthenticationScreen = () => {
  useBlockBackButton();
  const { params } = useRoute();
  const { setParams } = useNavigation();

  const { isNarrowPhone, isSmallPhone, isTallPhone } = useDimensions();

  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [value, setValue] = useState('');
  const [initialPin, setInitialPin] = useState('');
  const [actionType, setActionType] = useState(
    params.validPin ? 'authentication' : 'creation'
  );

  const dismissPinScreen = useDismissCurrentRoute(
    Routes.PIN_AUTHENTICATION_SCREEN
  );

  const finished = useRef(false);

  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  useEffect(() => {
    // See if the user previously tried and aborted
    // If that's the case, we need to update the default
    // amount of attempts left to prevent abuse
    const init = async () => {
      const defaultAttemptsLeft = await getPinAuthAttemptsLeft();
      if (!isNaN(defaultAttemptsLeft)) {
        setAttemptsLeft(defaultAttemptsLeft);
      }
    };

    init();

    return () => {
      if (!finished.current) {
        params.onCancel();
      }
    };
  }, [params, setParams]);

  useEffect(() => {
    const checkTimelock = async () => {
      // When opening the screen we need to check
      // if the user wasn't banned for too many tries
      const timelock = await getAuthTimelock();
      if (timelock) {
        const now = Date.now();
        const stillBanned = now < timelock;
        if (stillBanned) {
          const timeLeftMS = timelock - now;
          const timeAmountSeconds = timeLeftMS / 1000;
          const unit = timeAmountSeconds > 60 ? 'minutes' : 'seconds';
          const timeAmount =
            timeAmountSeconds > 60
              ? Math.ceil(timeAmountSeconds / 60)
              : Math.ceil(timeAmountSeconds);

          Alert.alert(
            'Still blocked',
            `You still need to wait ~ ${timeAmount} ${unit} before trying again`
          );
          params.onCancel();
          finished.current = true;
          dismissPinScreen();
        } else {
          await saveAuthTimelock(null);
          await savePinAuthAttemptsLeft(null);
        }
      }
    };

    checkTimelock();
  }, [dismissPinScreen, params]);

  useEffect(() => {
    if (attemptsLeft === 0) {
      Alert.alert(
        'Too many tries!',
        `You need to wait ${TIMELOCK_INTERVAL_MINUTES} minutes before trying again`
      );
      // Set global
      saveAuthTimelock(Date.now() + TIMELOCK_INTERVAL_MINUTES * 60 * 1000);
      params.onCancel();
      finished.current = true;
      dismissPinScreen();
    }
  }, [attemptsLeft, dismissPinScreen, params]);

  const handleNumpadPress = useCallback(
    newValue => {
      setValue(prevValue => {
        let nextValue = prevValue;
        if (nextValue === null) {
          nextValue = newValue;
        } else if (newValue === 'back') {
          // If pressing back while on confirmation and no value
          // we switch back to "creation" mode so the user can
          // reenter the original pin in case they did a mistake
          if (prevValue === '' && actionType === 'confirmation') {
            setActionType('creation');
            setInitialPin('');
            setValue('');
          } else {
            nextValue = prevValue.slice(0, -1);
          }
        } else {
          if (nextValue.length <= 3) {
            nextValue += newValue;
          }
        }

        if (nextValue.length === 4) {
          if (actionType === 'authentication') {
            const valid = params.validPin === nextValue;
            if (!valid) {
              setAttemptsLeft(attemptsLeft - 1);
              savePinAuthAttemptsLeft(attemptsLeft - 1);
              setTimeout(() => {
                setValue('');
              }, 300);
            } else {
              params.onSuccess(nextValue);
              finished.current = true;
              setTimeout(() => {
                dismissPinScreen();
              }, 300);
            }
          } else if (actionType === 'creation') {
            // Ask for confirmation
            setActionType('confirmation');
            // Store the pin in state so we can compare with the conf.
            setInitialPin(nextValue);

            // Clear the pin
            setTimeout(() => {
              setValue('');
            }, 300);
          } else {
            // Confirmation
            const valid = initialPin === nextValue;
            if (valid) {
              params.onSuccess(nextValue);
              finished.current = true;
              setTimeout(() => {
                dismissPinScreen();
              }, 300);
            }
          }
        }

        return nextValue;
      });
    },
    [actionType, attemptsLeft, dismissPinScreen, initialPin, params]
  );

  const titleMap = useMemo(
    () => ({
      authentication: params?.promptMessage || 'Type your PIN',
      creation: 'Choose your PIN',
      confirmation: 'Confirm your PIN',
    }),
    [params]
  );

  return (
    <Column
      backgroundColor={colors.backgroundBlue}
      flex={1}
      testID="pin-authentication-screen"
    >
      <Centered flex={1}>
        <ColumnWithMargins
          align="center"
          css={padding(0, 24, isNarrowPhone ? 12 : 24)}
          height="25%"
          justify="center"
          margin={isSmallPhone ? 0 : 28}
        >
          <CenteredContainer>
            <Icon name="cardstack" size={layouts.iconSize} />
            <Text
              fontSize={18}
              marginTop={6}
              textTransform="uppercase"
              variant="welcomeScreen"
            >
              {appName}
            </Text>
          </CenteredContainer>
          <Text
            color="white"
            fontSize={18}
            textAlign="center"
            weight="extraBold"
          >
            {titleMap[actionType]}
          </Text>
          <PinValue value={value} />
        </ColumnWithMargins>
      </Centered>
      <ColumnWithMargins align="center" margin={isTallPhone ? 27 : 12}>
        <Centered maxWidth={313}>
          <Numpad
            decimal={false}
            light
            onPress={handleNumpadPress}
            width={isNarrowPhone ? 275 : '100%'}
          />
        </Centered>
      </ColumnWithMargins>
    </Column>
  );
};

export default React.memo(PinAuthenticationScreen);
