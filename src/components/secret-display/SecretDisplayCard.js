import { useTheme } from '@shopify/restyle';
import { times } from 'lodash';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import CopyTooltip from '../copy-tooltip';
import { Centered, ColumnWithMargins, Row, RowWithMargins } from '../layout';
import { Text } from '../text';
import WalletTypes from '@rainbow-me/helpers/walletTypes';
import { fonts, padding } from '@rainbow-me/styles';

const Content = styled(Centered)`
  ${padding(19, 30, 24)};
  margin-bottom: 48px;
  border-radius: 25;
  overflow: hidden;
  z-index: 1;
`;

const GridItem = styled(Row).attrs({
  align: 'center',
})`
  height: ${fonts.lineHeight.looser};
`;

const GridText = styled(Text).attrs(({ weight = 'semibold' }) => ({
  lineHeight: 'looser',
  size: 'lmedium',
  weight,
}))``;

function SeedWordGrid({ seed }) {
  const columns = useMemo(() => {
    const words = seed.split(' ');
    return [words.slice(0, words.length / 2), words.slice(words.length / 2)];
  }, [seed]);

  const { colors } = useTheme();

  return (
    <RowWithMargins margin={64}>
      {columns.map((wordColumn, colIndex) => (
        <RowWithMargins key={wordColumn.join('')} margin={12}>
          <ColumnWithMargins margin={16}>
            {times(wordColumn.length, index => {
              const number = Number(index + 1 + colIndex * wordColumn.length);
              return (
                <GridItem justify="end" key={`grid_number_${number}`}>
                  <GridText align="right" color={colors.black}>
                    {number}
                  </GridText>
                </GridItem>
              );
            })}
          </ColumnWithMargins>
          <ColumnWithMargins margin={16}>
            {wordColumn.map((word, index) => (
              <GridItem key={`${word}${index}`}>
                <GridText weight="bold">{word}</GridText>
              </GridItem>
            ))}
          </ColumnWithMargins>
        </RowWithMargins>
      ))}
    </RowWithMargins>
  );
}

export default function SecretDisplayCard({ seed, type }) {
  return (
    <Centered>
      <Content>
        <CopyTooltip textToCopy={seed} tooltipText="Copy to clipboard">
          {seed && type === WalletTypes.mnemonic && (
            <SeedWordGrid seed={seed} />
          )}
          {seed && type === WalletTypes.privateKey && (
            <GridText align="center">{seed}</GridText>
          )}
        </CopyTooltip>
      </Content>
    </Centered>
  );
}
