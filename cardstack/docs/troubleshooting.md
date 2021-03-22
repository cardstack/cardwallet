# Troubleshooting Guide

This is the list of all the most common React-Native and Native build issues we experienced during development.

---

### ios/debug.xcconfig: unable to open file (in project "Rainbow") (in target 'Rainbow' from project 'Rainbow') 

Remove the following line from your `/ios/Rainbow.xcodeproj`:

```
15DC38CE247E0E0900919009 /* debug.xcconfig */ = {isa = PBXFileReference; lastKnownFileType = text.xcconfig; path = debug.xcconfig; sourceTree = SOURCE_ROOT; };
```
