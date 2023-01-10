import Clipboard from '@react-native-community/clipboard';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import Mailer from 'react-native-mail';

import {
  appName,
  appVersion,
  SUPPORT_EMAIL_ADDRESS,
} from '@cardstack/constants';
import { Device } from '@cardstack/utils';

import { Alert } from '../components/alerts';

const setClipboardToFeedbackEmail = () =>
  Clipboard.setString(SUPPORT_EMAIL_ADDRESS);

const FeedbackErrorAlert = () =>
  Alert({
    buttons: [
      {
        onPress: setClipboardToFeedbackEmail,
        text: 'Copy email address',
      },
      {
        style: 'cancel',
        text: 'No thanks',
      },
    ],
    message:
      'Would you like to manually copy our feedback email address to your clipboard?',
    title: 'Error launching email client',
  });

const handleMailError = debounce(
  error => (error ? FeedbackErrorAlert() : null),
  250
);

function feedbackEmailOptions(appVersion) {
  return {
    recipients: [SUPPORT_EMAIL_ADDRESS],
    subject: `${appName} Feedback - ${
      Device.isIOS ? 'iOS' : 'Android'
    } ${appVersion}`,
  };
}

export default function useSendFeedback() {
  const onSendFeedback = useCallback(
    () => Mailer.mail(feedbackEmailOptions(appVersion), handleMailError),
    []
  );
  return onSendFeedback;
}
