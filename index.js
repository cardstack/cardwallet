import 'react-native-gesture-handler';
import './shim';

import lang from 'i18n-js';
import numbro from 'numbro';
import numbroLangs from 'numbro/dist/languages.min';
import { getLocales } from 'react-native-localize';
import { resources } from './src/languages';

const USE_STORYBOOK = false;

// Languages (i18n)
lang.defaultLocale = 'en';
lang.locale = getLocales()?.[0]?.languageCode || 'en';
lang.fallbacks = true;

lang.translations = Object.assign(
  {},
  ...Object.keys(resources).map(key => ({
    [key]: resources[key].translation,
  }))
);

const configureNumbroUsingLanguageTag = tagOrCountryCode => {
  Object.values(numbroLangs).forEach(l => numbro.registerLanguage(l));
  const numbroLang = numbro.language();

  if (tagOrCountryCode && tagOrCountryCode !== numbroLang) {
    let tagLanguageData = numbro.languageData();

    try {
      tagLanguageData = numbro.languageData(tagOrCountryCode);
    } catch (error) {
      // sometimes languageTags are not correct or not exist in numbro languages list
      const numbroLanguageTagKeys = Object.keys(numbroLangs);

      const bestMatchLanguageTag = numbroLanguageTagKeys.find(key =>
        key.includes(tagOrCountryCode)
      );

      if (bestMatchLanguageTag) {
        numbro.setLanguage(bestMatchLanguageTag);
        return;
      }
    }

    if (tagLanguageData) {
      numbro.setLanguage(tagOrCountryCode);
    }
  }
};

const initializeApp = () => {
  // set numbro config based on selected country code(default 'en' as same number format for english countries)
  configureNumbroUsingLanguageTag(getLocales()?.[0]?.countryCode || 'en');
  if (!USE_STORYBOOK) {
    require('./src/App');
  } else {
    require('./cardstack/storybook');
  }
};

initializeApp();
