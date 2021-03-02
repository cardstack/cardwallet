import React, { useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';

import downIcon from '../../assets/chevron-down.png';
import openIcon from '../../assets/chevron-up.png';
import infoIcon from '../../assets/info-blue.png';
import { Container } from '@cardstack/components';

export interface SystemNotificationProps {
  children: React.ReactNode;
  openedComponent: React.ReactNode;
}

export const SystemNotification = ({
  openedComponent,
  children,
}: SystemNotificationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      testID="system-notification"
    >
      <Container
        backgroundColor="backgroundGray"
        padding={4}
        width="95%"
        borderRadius={10}
      >
        <Container
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={isOpen ? 4 : 0}
        >
          <Container height={22} width={22} marginRight={2}>
            <Image
              source={infoIcon}
              resizeMode="contain"
              style={{
                height: '100%',
                width: '100%',
              }}
            />
          </Container>
          {!isOpen && children}
          <Container height={14} width={14} marginLeft={2}>
            <Image
              source={isOpen ? openIcon : downIcon}
              resizeMode="contain"
              style={{
                height: '100%',
                width: '100%',
              }}
            />
          </Container>
        </Container>
        {isOpen && openedComponent}
      </Container>
    </TouchableOpacity>
  );
};
