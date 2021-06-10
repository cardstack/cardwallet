export const numberWithCommas = (number: string) =>
  number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const getAddressPreview = (address: string): string => {
  if (!address) {
    return '';
  }

  const addressStart = address.slice(0, 6);
  const addressEnd = address.slice(-4);

  return `${addressStart}...${addressEnd}`;
};
