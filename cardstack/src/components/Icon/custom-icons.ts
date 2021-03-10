import checkCircle from '../../assets/icons/check-circle.svg';
import circle from '../../assets/icons/circle.svg';
import error from '../../assets/icons/error.svg';
import gift from '../../assets/icons/gift.svg';
import infoBlue from '../../assets/icons/info-blue.svg';
import infoWhite from '../../assets/icons/info-white.svg';
import moreCircle from '../../assets/icons/more-circle.svg';
import pay from '../../assets/icons/pay.svg';
import pin from '../../assets/icons/pin.svg';
import qrCode from '../../assets/icons/qr-code.svg';
import reload from '../../assets/icons/reload.svg';
import send from '../../assets/icons/send.svg';
import success from '../../assets/icons/success.svg';
import swap from '../../assets/icons/swap.svg';
import warning from '../../assets/icons/warning.svg';

export const customIcons = {
  'check-circle': checkCircle,
  'info-blue': infoBlue,
  'info-white': infoWhite,
  'more-circle': moreCircle,
  'qr-code': qrCode,
  circle: circle,
  error: error,
  gift: gift,
  pay: pay,
  pin: pin,
  reload: reload,
  send: send,
  success: success,
  swap: swap,
  warning: warning,
};

export type CustomIconNames = keyof typeof customIcons;