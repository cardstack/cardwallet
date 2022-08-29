import { keys } from 'lodash';

import { supportedCountries } from './supportedCountries';

const WYRE_SUPPORTED_COUNTRIES_ISO = keys(supportedCountries);

export { supportedCountries, WYRE_SUPPORTED_COUNTRIES_ISO };
