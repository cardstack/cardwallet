import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useMemo } from 'react';
import { SlackSheet } from '../sheet';
import { Container, Text } from '@cardstack/components';
import { screenHeight } from '@cardstack/utils';
import { supportedCountries } from '@rainbow-me/references/wyre';

const CHART_HEIGHT = screenHeight * 0.85;

const countries = Object.keys(supportedCountries);

const SupportedCountriesList = () => {
  return useMemo(
    () => (
      <Container flexDirection="row" justifyContent="space-between">
        <Container>
          {countries
            .filter((_, index) => index < countries.length / 2)
            .map(item => (
              <Text key={item} marginBottom={4}>
                {
                  supportedCountries[item as keyof typeof supportedCountries]
                    .name
                }{' '}
                ({item as keyof typeof supportedCountries})
              </Text>
            ))}
        </Container>
        <Container>
          {countries
            .filter((_, index) => index > countries.length / 2)
            .map(item => (
              <Text key={item} marginBottom={4}>
                {
                  supportedCountries[item as keyof typeof supportedCountries]
                    .name
                }{' '}
                ({item as keyof typeof supportedCountries})
              </Text>
            ))}
        </Container>
      </Container>
    ),
    []
  );
};

export default function SupportAndFeedsState() {
  const { setOptions } = useNavigation();
  useEffect(() => {
    setOptions({
      longFormHeight: CHART_HEIGHT,
    });
  }, [setOptions]);

  return useMemo(
    () => (
      <SlackSheet scrollEnabled>
        <Container padding={6}>
          <Container alignItems="center" paddingBottom={12}>
            <Text color="black" fontWeight="bold" size="medium">
              Support & Fees
            </Text>
          </Container>
          <Text color="black" fontSize={18} fontWeight="bold" marginBottom={3}>
            Activation Fee
          </Text>
          <Text>- 2.9 % of Facevalue + $.30 ($5 min) USA</Text>
          <Text marginBottom={6}>
            - 3.9% of Facevalue + $.30 ($5 min) International
          </Text>
          <Text>
            <Text color="black" fontWeight="bold">
              USA:
            </Text>{' '}
            $500 per week max, $5000 per year max International: $1,000 per week
            max equivalent, $7,5000 yearly max equivalent Cardpay does not
            currently work in NY & TX
          </Text>
          <Text marginBottom={6}>
            <Text color="black" fontWeight="bold">
              International:
            </Text>{' '}
            $1,000 per week max equivalent, $7,5000 yearly max equivalent
          </Text>
          <Text marginBottom={12}>
            Cardpay does not currently work in NY & TX
          </Text>

          <Text color="black" fontSize={18} fontWeight="bold" marginBottom={6}>
            Supported Countries
          </Text>
          <SupportedCountriesList />
        </Container>
      </SlackSheet>
    ),
    []
  );
}
