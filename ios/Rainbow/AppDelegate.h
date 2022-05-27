/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


#import <Foundation/Foundation.h>
#import <Rainbow-Internals/Internals.h>

#import <React/RCTBridgeDelegate.h>
#import <Firebase.h>
#import <Expo/Expo.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UserNotifications.h>


@interface AppDelegate : EXAppDelegateWrapper <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate, FIRMessagingDelegate>

- (void)hideSplashScreenAnimated;

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic) BOOL isRapRunning;

@end
