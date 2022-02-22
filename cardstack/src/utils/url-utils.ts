export const isEncodedUri = (uri = ''): boolean =>
  uri !== decodeURIComponent(uri);

export const decodeNestedURI = (uri: string): string => {
  while (isEncodedUri(uri)) {
    uri = decodeURIComponent(uri);
  }

  return uri;
};
