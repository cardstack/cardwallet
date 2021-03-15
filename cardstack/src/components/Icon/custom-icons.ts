import checkCircle from '../../assets/icons/check-circle.svg';
import cardstack from '../../assets/icons/cardstack.svg';
import circle from '../../assets/icons/circle.svg';
import cloud from '../../assets/icons/cloud.svg';
import error from '../../assets/icons/error.svg';
import gift from '../../assets/icons/gift.svg';
import infoBlue from '../../assets/icons/info-blue.svg';
import infoWhite from '../../assets/icons/info-white.svg';
import moreCircle from '../../assets/icons/more-circle.svg';
import pay from '../../assets/icons/pay.svg';
import pin from '../../assets/icons/pin.svg';
import qrCode from '../../assets/icons/qr-code.svg';
import reload from '../../assets/icons/reload.svg';
import refresh from '../../assets/icons/refresh.svg';
import send from '../../assets/icons/send.svg';
import success from '../../assets/icons/success.svg';
import swap from '../../assets/icons/swap.svg';
import warning from '../../assets/icons/warning.svg';
import faceId from '../../assets/icons/face-id.svg';
import thumbprint from '../../assets/icons/thumbprint.svg';

export const customIcons = {
  'check-circle': checkCircle,
  'face-id': faceId,
  'info-blue': infoBlue,
  'info-white': infoWhite,
  'more-circle': moreCircle,
  'qr-code': qrCode,
  cardstack: cardstack,
  circle: circle,
  cloud: cloud,
  error: error,
  gift: gift,
  pay: pay,
  pin: pin,
  reload: reload,
  refresh: refresh,
  send: send,
  success: success,
  swap: swap,
  thumbprint: thumbprint,
  warning: warning,
};

export type CustomIconNames = keyof typeof customIcons;
