import React, { memo } from 'react';
import { SectionHeaderText } from './SectionHeaderText';
import {
  Container,
  CenteredContainer,
  Icon,
  IconProps,
  Text,
} from '@cardstack/components';

interface SectionIconTitleProps {
  title: string;
  iconProps: IconProps;
  sectionHeaderText: string;
}

export const SectionIconTitle = memo(
  ({ title, iconProps, sectionHeaderText }: SectionIconTitleProps) => (
    <Container marginTop={8} width="100%">
      <SectionHeaderText>{sectionHeaderText}</SectionHeaderText>
      <Container paddingHorizontal={2} marginTop={4}>
        <Container flexDirection="row">
          <CenteredContainer>
            <Icon {...iconProps} />
          </CenteredContainer>
          <Text marginLeft={4} weight="extraBold">
            {title}
          </Text>
        </Container>
      </Container>
    </Container>
  )
);
