import React from 'react';
import { getDisplayDataByStatus } from './statusToDisplayData';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
  TransactionRow,
} from './TransactionBase';
import { ERC20TransactionType } from '@cardstack/types';
import { CoinIcon, SafeHeader } from '@cardstack/components';
import { colors, avatarColor } from '@cardstack/theme';
import { getAddressPreview } from '@cardstack/utils';
import { useAccountProfile } from '@rainbow-me/hooks';

export interface ERC20TransactionProps
  extends TransactionBaseCustomizationProps {
  item: ERC20TransactionType;
}

export const ERC20Transaction = ({ item, ...props }: ERC20TransactionProps) => {
  const displayData = getDisplayDataByStatus(item.status);

  const swappedForDisplayData = item.swappedFor
    ? getDisplayDataByStatus(item.swappedFor.status)
    : displayData;

  const { accountAddress, accountColor, accountName } = useAccountProfile();
  const isSentTransaction = item.to !== accountAddress;

  const calculatedProps = item.swappedFor
    ? {
        Footer: (
          <TransactionRow
            CoinIcon={<CoinIcon size={40} {...item} />}
            statusIconName={displayData.iconProps.name}
            statusIconProps={displayData.iconProps}
            statusText={item.title}
            primaryText={`${displayData.transactionSymbol} ${item.balance.display}`}
            subText={item.native.display}
            paddingBottom={4}
          />
        ),
        Header: (
          <SafeHeader
            address={item.to}
            accountName={accountName}
            backgroundColor={accountColor}
            textColor={colors.white}
            rightText="Other Tokens"
            small
          />
        ),
        CoinIcon: <CoinIcon size={40} {...item.swappedFor} />,
        statusIconName: swappedForDisplayData.iconProps.name,
        statusIconProps: swappedForDisplayData.iconProps,
        statusText: item.swappedFor.title,
        primaryText: `${swappedForDisplayData.transactionSymbol} ${item.swappedFor.balance.display}`,
        subText: item.swappedFor.native.display,
        transactionHash: item.swappedFor.hash,
      }
    : {
        CoinIcon: <CoinIcon size={40} {...item} />,
        Header: (
          <SafeHeader
            address={item.to}
            accountName={accountName}
            backgroundColor={avatarColor[accountColor]}
            textColor={colors.white}
            rightText="Other Tokens"
            small
          />
        ),
        statusIconName: displayData.iconProps.name,
        statusIconProps: displayData.iconProps,
        statusText: item.title,
        primaryText: `${displayData.transactionSymbol} ${item.balance.display}`,
        subText: item.native.display,
        transactionHash: item.hash,
      };

  return (
    <TransactionBase
      {...props}
      {...calculatedProps}
      recipientName={isSentTransaction ? getAddressPreview(item.to) : undefined}
    />
  );
};
