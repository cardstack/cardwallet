#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "Internals-Bridging-Header.h"
#import "Internals.h"

FOUNDATION_EXPORT double Rainbow_InternalsVersionNumber;
FOUNDATION_EXPORT const unsigned char Rainbow_InternalsVersionString[];

