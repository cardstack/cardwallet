import React, { memo, useCallback } from 'react';
import { FlatList } from 'react-native';

import { Container, Sheet, Text } from '@cardstack/components';

import { supportedCountries } from '@rainbow-me/references/wyre';

import { strings } from './strings';

type Country = keyof typeof supportedCountries;
const countriesKeys = Object.keys(supportedCountries);

const SupportAndFeesSheet = () => {
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

  return (
    <Sheet isFullScreen scrollEnabled>
      <Container marginBottom={12} padding={6}>
        <Text
          color="black"
          paddingBottom={12}
          size="medium"
          textAlign="center"
          weight="bold"
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
        <FlatList data={countriesKeys} numColumns={2} renderItem={renderItem} />
      </Container>
    </Sheet>
  );
};

const TextBoldStart = ({ title, info }: { title: string; info: string }) => (
  <Text>
    <Text color="black" weight="bold">
      {title}
    </Text>
    {info}
  </Text>
);

const SectionHeaderText = ({ text }: { text: string }) => (
  <Text color="black" fontSize={18} marginBottom={4} weight="bold">
    {text}
  </Text>
);

export default memo(SupportAndFeesSheet);
