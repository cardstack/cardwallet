import React, { memo } from 'react';

import { Container } from '@cardstack/components';

import { TagPressable } from './TagPressable';

interface TagCloudProps {
  tags: Array<string>;
  selectedTags?: Array<number>;
  onTagSelection?: (index: number) => void;
}

const TagCloud = ({
  tags,
  selectedTags = [],
  onTagSelection,
}: TagCloudProps) => {
  return (
    <Container
      paddingVertical={5}
      paddingHorizontal={2}
      width="100%"
      flexDirection="row"
      justifyContent="center"
      flexWrap="wrap"
    >
      {tags.map((tag: string, index: number) => (
        <Container padding={1}>
          <TagPressable
            text={tag}
            selected={selectedTags.includes(index)}
            onPress={() => onTagSelection?.(index)}
          />
        </Container>
      ))}
    </Container>
  );
};

export default memo(TagCloud);
