import { useRoute } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import { FlatList } from 'react-native';

import { Container, Sheet, Text } from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';
import { SupportedCountries } from '@cardstack/services/wyre-api';

import { strings } from './strings';

type NavParams = { supportedCountries: SupportedCountries };

const SupportAndFeesSheet = () => {
  const {
    params: { supportedCountries },
  } = useRoute<RouteType<NavParams>>();

  const renderItem = useCallback(
    ({ item: country }: { item: string }) => (
      <Container flex={1} marginBottom={2}>
        <Text>{`${supportedCountries[country].name} (${country})`}</Text>
      </Container>
    ),
    [supportedCountries]
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
        <FlatList
          data={Object.keys(supportedCountries)}
          numColumns={2}
          renderItem={renderItem}
        />
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
