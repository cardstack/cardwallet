import supportedNativeCurrencies from '@cardstack/cardpay-sdk/sdk/native-currencies';
import lang from 'i18n-js';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import {
  settingsChangeLanguage as changeLanguage,
  settingsChangeNativeCurrency as changeNativeCurrency,
} from '../redux/settings';

const languageSelector = state => state.settings.language;

const withLanguage = language => {
  if (language !== lang.locale) {
    lang.locale = language;
  }
  return { language };
};

const createLanguageSelector = createSelector([languageSelector], withLanguage);

export default function useAccountSettings() {
  const { language } = useSelector(createLanguageSelector);
  const dispatch = useDispatch();
  const settingsData = useSelector(
    ({
      settings: {
        accountAddress,
        chainId,
        nativeCurrency,
        network,
        showTestnets,
      },
    }) => ({
      accountAddress,
      chainId,
      language,
      nativeCurrency,
      nativeCurrencySymbol: supportedNativeCurrencies[nativeCurrency].symbol,
      network,
      showTestnets,
    })
  );

  const settingsChangeLanguage = useCallback(
    language => dispatch(changeLanguage(language)),
    [dispatch]
  );

  const settingsChangeNativeCurrency = useCallback(
    currency => dispatch(changeNativeCurrency(currency)),
    [dispatch]
  );

  return {
    settingsChangeLanguage,
    settingsChangeNativeCurrency,
    ...settingsData,
  };
}
