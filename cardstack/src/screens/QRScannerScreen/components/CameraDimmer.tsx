import React from 'react';
import Animated, {
  and,
  block,
  cond,
  eq,
  min,
  set,
  sub,
  Value,
} from 'react-native-reanimated';
import styled from 'styled-components';
import { useMemoOne } from 'use-memo-one';
import { scrollPosition } from '@rainbow-me/navigation/ScrollPagerWrapper';
import { useReanimatedValue } from '@rainbow-me/components/list/MarqueeList';

const Dim = styled(Animated.View)`
  flex: 1;
  width: 100%;
`;

export default function CameraDimmer({
  children,
}: {
  children: React.ReactNode;
}) {
  const prev = (useReanimatedValue(0) as unknown) as Value<number>;
  const prevMem = (useReanimatedValue(0) as unknown) as Value<number>;

  const style = useMemoOne(
    () => ({
      opacity: block([
        set(prevMem, prev),
        set(prev, scrollPosition),

        cond(
          and(eq(prevMem, 2), eq(scrollPosition, 1)),
          1,
          cond(
            and(eq(prevMem, 1), eq(scrollPosition, 2)),
            1,
            min(sub(scrollPosition, 1), 0.9)
          )
        ),
      ]),
    }),
    []
  );

  return <Dim style={style}>{children}</Dim>;
}
