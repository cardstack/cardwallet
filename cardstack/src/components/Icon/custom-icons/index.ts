export const customIcons = {
  'check-circle': require('./check-circle').default,
  'face-id': require('./face-id').default,
  'info-blue': require('./info-blue').default,
  'info-white': require('./info-white').default,
  'more-circle': require('./more-circle').default,

  'qr-code': require('./qr-code').default,
  'question-square': require('./question-square').default,
  'refresh-2': require('./refresh-2').default,
  cardstack: require('./cardstack').default,
  circle: require('./circle').default,
  cloud: require('./cloud').default,
  error: require('./error').default,
  gift: require('./gift').default,
  more: require('./more').default,
  pay: require('./pay').default,
  pin: require('./pin').default,
  refresh: require('./refresh').default,
  reload: require('./reload').default,
  send: require('./send').default,
  success: require('./success').default,
  swap: require('./swap').default,
  thumbprint: require('./thumbprint').default,
  warning: require('./warning').default,
};

export type CustomIconNames = keyof typeof customIcons;
