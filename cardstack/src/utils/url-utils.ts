export const isEncodedUri = (uri: string): boolean => {
  uri = uri || '';

  return uri !== decodeURIComponent(uri);
};

export const fullyDecodeURI = (uri: string): string => {
  while (isEncodedUri(uri)) {
    uri = decodeURIComponent(uri);
  }

  return uri;
};
