import { dateFormatter } from '@cardstack/utils';

export const strings = {
  lastUpdatedAt: (timestamp: string) =>
    `Last updated at: ${dateFormatter(
      parseFloat(timestamp),
      'MM/dd/yy',
      'h:mm a',
      ', '
    )}`,
  newCardLabel: 'New Card',
  emptyCardMessage: `You don't own any\nPrepaid Cards yet`,
};
