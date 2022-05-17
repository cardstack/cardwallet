import React from 'react';
import Toast from './Toast';

export default function InvalidPasteToast(props) {
  return (
    <Toast
      isVisible={props.isInvalidPaste}
      text="You can't paste that here"
      {...props}
    />
  );
}
