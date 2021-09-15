import { format } from 'date-fns';

export type Units = 'days' | 'hours';

const calculateTimestampOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);

  return d.getTime();
};

const calculateTimestampOfYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0, 0, 0, 0);

  return d.getTime();
};

/**
 * @param timeAgo how far ago the timestamp should correspond to
 * @param unit hours or days
 * @returns timestamp
 */
const calculateTimeStampNTimeAgo = (timeAgo = 0, unit: Units = 'days') => {
  const d = new Date();

  if (unit === 'days') {
    d.setDate(d.getDate() - timeAgo);
    d.setHours(0, 0, 0, 0);
  } else if (unit === 'hours') {
    d.setDate(d.getDate());
    d.setHours(d.getHours() - timeAgo, 0, 0, 0);
  }

  return d.getTime();
};

const calculateTimestampOfThisMonth = () => {
  const d = new Date();
  d.setDate(0);
  d.setHours(0, 0, 0, 0);

  return d.getTime();
};

const calculateTimestampOfThisYear = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear(), 0, 1);
  d.setHours(0, 0, 0, 0);

  return d.getTime();
};

const todayTimestamp = calculateTimestampOfToday();
const yesterdayTimestamp = calculateTimestampOfYesterday();
const thisMonthTimestamp = calculateTimestampOfThisMonth();
const thisYearTimestamp = calculateTimestampOfThisYear();

export const groupTransactionsByDate = (transaction: {
  timestamp?: string;
  minedAt?: string;
  createdAt?: string;
}) => {
  const timeStamp =
    transaction.timestamp || transaction.minedAt || transaction.createdAt || '';

  const ts = parseInt(timeStamp, 10) * 1000;

  if (ts > todayTimestamp) return 'Today';
  if (ts > yesterdayTimestamp) return 'Yesterday';
  if (ts > thisMonthTimestamp) return 'This Month';

  return format(ts, `MMMM${ts > thisYearTimestamp ? '' : ' yyyy'}`);
};

/**
 * @param amount number of timestamp increments
 * @param unit days or hours
 * @returns an array of timestamps with number of items as amount and the spacing with unit
 */
export const getTimestamps = (amount: number, unit: Units) => {
  let timestamps: number[] = [];

  for (let i = 0; i < amount; i++) {
    const ts = calculateTimeStampNTimeAgo(i, unit);

    timestamps = [...timestamps, ts];
  }

  return timestamps;
};

/**
 * @param amount number of points
 * @param unit days or hours
 * @returns timestamp if accumulation timestamp is included in range, otherwise 0
 */
export const groupAccumulations = (
  amount = 30,
  unit: Units = 'days'
) => (accumulation: { timestamp: string }) => {
  const timestamps = getTimestamps(amount, unit);

  for (let i = 0; i < timestamps.length; i++) {
    const ts = timestamps[i];
    const accumulationTs = parseInt(accumulation.timestamp, 10) * 1000;

    if (Number(accumulationTs) > ts) {
      return ts;
    }
  }

  return '0';
};

export const dateFormatter = (ts: number) => {
  const timestamp = new Date(ts * 1000);
  return `${format(timestamp, 'MMM-dd-yyyy')} \n${format(
    timestamp,
    'h:mm:ss a'
  )} UTC+`;
};
