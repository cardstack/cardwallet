import React, { memo } from 'react';
import { SectionHeaderText } from './SectionHeaderText';
import { Container, Icon, IconProps, Text } from '@cardstack/components';

interface SectionIconTitleProps {
  title?: string;
  iconProps?: IconProps;
  sectionHeaderText?: string;
}

export const SectionIconTitle = memo(
  ({ title, iconProps, sectionHeaderText }: SectionIconTitleProps) => (
    <Container marginTop={8} width="100%">
      {!!sectionHeaderText && (
        <SectionHeaderText>{sectionHeaderText}</SectionHeaderText>
      )}
      <Container paddingHorizontal={3} marginTop={4}>
        <Container flexDirection="row">
          {!!iconProps && (
            <Container>
              <Icon {...iconProps} />
            </Container>
          )}
          {!!title && (
            <Text marginLeft={4} weight="extraBold">
              {title}
            </Text>
          )}
        </Container>
      </Container>
    </Container>
  )
);
