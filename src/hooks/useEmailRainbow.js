import { debounce, upperFirst } from 'lodash';
import { useCallback, useMemo } from 'react';
import Mailer from 'react-native-mail';
import { Alert } from '../components/alerts';
import useClipboard from './useClipboard';
import { SUPPORT_EMAIL_ADDRESS } from '@cardstack/constants';

export default function useEmailRainbow({
  emailAddress = SUPPORT_EMAIL_ADDRESS,
  subject = 'feedback',
}) {
  const { setClipboard } = useClipboard();

  const emailOptions = useMemo(
    () => ({
      recipients: [emailAddress],
      subject: `Cardstack ${upperFirst(subject)}`,
    }),
    [emailAddress, subject]
  );

  const handleFallbackAlert = useCallback(
    error =>
      error
        ? Alert({
            buttons: [
              {
                onPress: () => setClipboard(emailAddress),
                text: 'Copy email address',
              },
              {
                style: 'cancel',
                text: 'No thanks',
              },
            ],
            message: `Would you like to manually copy our email address to your clipboard?`,
            title: 'Unable to auto-launch email client',
          })
        : null,
    [emailAddress, setClipboard]
  );

  return useCallback(
    () => Mailer.mail(emailOptions, debounce(handleFallbackAlert, 250)),
    [emailOptions, handleFallbackAlert]
  );
}
