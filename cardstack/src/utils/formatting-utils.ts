export const numberWithCommas = (number: string) =>
  number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
