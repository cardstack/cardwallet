import React, { memo } from 'react';

import { Container, FloatingTag } from '@cardstack/components';

interface TagCloudProps {
  tags: Array<string>;
  selectedTags?: Array<number>;
  onTagSelection?: (index: number) => void;
}

const TagCloud = ({
  tags,
  selectedTags = [],
  onTagSelection,
}: TagCloudProps) => (
  <Container>
    {tags.map((tag: string, index: number) => {
      selectedTags.includes(index) ? (
        <FloatingTag copy={tag} theme={{ color: 'secondaryText' }} />
      ) : (
        <FloatingTag copy={tag} onPress={() => onTagSelection?.(index)} />
      );
    })}
  </Container>
);

export default memo(TagCloud);
