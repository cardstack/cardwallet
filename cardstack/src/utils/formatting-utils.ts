export const numberWithCommas = (number: string) =>
  number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const getAddressPreview = (address: string): string => {
  if (!address) {
    return '';
  }

  const addressStart = address.slice(0, 4);
  const addressEnd = address.slice(-4);

  return `${addressStart}...${addressEnd}`;
};

// Removes dash and everything after it
export const normalizeTxHash = (hash: string) => hash.replace(/-.*/g, '');
