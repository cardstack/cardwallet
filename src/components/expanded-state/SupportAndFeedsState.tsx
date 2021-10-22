import React, { useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';
import { SlackSheet } from '../sheet';
import { Container, Text } from '@cardstack/components';
import { supportedCountries } from '@rainbow-me/references/wyre';

type Country = keyof typeof supportedCountries;
const countriesKeys = Object.keys(supportedCountries);

const strings = {
  header: `Support & Fees`,
  activation: {
    title: 'Activation Fee',
    faceValueList: `- 2.9% of Facevalue + $.30 ($5 min) USA\n- 3.9% of Facevalue + $.30 ($5 min) International`,
    limits: {
      usa: {
        title: 'USA: ',
        info: '$500 per week max, $5000 per year max',
      },
      international: {
        title: 'International: ',
        info: '$1,000 per week  max equivalent, $7,500 yearly max equivalent',
      },
    },
    footerInfo: `Card Pay does not currently work in NY & TX\nWyre currently only supports Visa or Mastercard`,
  },
  supportedCountriesTitle: 'Supported Countries',
};

const SupportAndFeedsState = () => {
  const renderItem = useCallback(
    ({ item: country }) => (
      <Container flex={1} marginBottom={2}>
        <Text>
          {`${supportedCountries[country as Country].name} (${country})`}
        </Text>
      </Container>
    ),
    []
  );

  // Workaround to avoid not dismiss modal
  return useMemo(
    () => (
      <SlackSheet scrollEnabled>
        <Container marginBottom={12} padding={6}>
          <Text
            color="black"
            fontWeight="bold"
            paddingBottom={12}
            size="medium"
            textAlign="center"
          >
            {strings.header}
          </Text>
          <SectionHeaderText text={strings.activation.title} />
          <Text>{strings.activation.faceValueList}</Text>
          <Container paddingVertical={3}>
            <TextBoldStart
              info={strings.activation.limits.usa.info}
              title={strings.activation.limits.usa.title}
            />
            <TextBoldStart
              info={strings.activation.limits.international.info}
              title={strings.activation.limits.international.title}
            />
          </Container>
          <Text marginBottom={10}>{strings.activation.footerInfo}</Text>
          <SectionHeaderText text={strings.supportedCountriesTitle} />
          <FlatList
            data={countriesKeys}
            numColumns={2}
            renderItem={renderItem}
          />
        </Container>
      </SlackSheet>
    ),
    [renderItem]
  );
};

const TextBoldStart = ({ title, info }: { title: string; info: string }) => (
  <Text>
    <Text color="black" fontWeight="bold">
      {title}
    </Text>
    {info}
  </Text>
);

const SectionHeaderText = ({ text }: { text: string }) => (
  <Text color="black" fontSize={18} fontWeight="bold" marginBottom={4}>
    {text}
  </Text>
);

export default SupportAndFeedsState;
