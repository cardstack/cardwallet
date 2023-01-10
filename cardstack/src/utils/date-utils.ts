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

  const ts = parseInt(timeStamp) * 1000;

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
    const accumulationTs = parseInt(accumulation.timestamp) * 1000;

    if (Number(accumulationTs) > ts) {
      return ts;
    }
  }

  return '0';
};

// Unix timestamp measures time as a number of seconds,
// whereas in JavaScript  measures  time as number of milliseconds
const MS = 1000;

export const jsTimestampToUnixString = (ts?: number) =>
  ts ? Math.floor(ts / MS).toString() : '';

const unixTimestampToJs = (ts: number) => ts * MS;

// The default timestamp is in unix because all the services
// return this format
export const dateFormatter = (
  unixTimestamp: number,
  dateTimeFormat = 'MMM-dd-yyyy',
  timeFormat = 'h:mm:ss a',
  delimitation = '\n'
) => {
  const timestamp = new Date(unixTimestampToJs(unixTimestamp));

  return `${format(timestamp, dateTimeFormat)}${delimitation}${format(
    timestamp,
    timeFormat
  )}`;
};
