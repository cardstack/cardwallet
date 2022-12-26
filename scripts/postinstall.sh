#!/bin/bash
set -eo pipefail


# Ignore any potential tracked changes to mutable development files.
git update-index --assume-unchanged "ios/Internals/ios/Internals.h"
git update-index --assume-unchanged "ios/Internals/ios/Internals.m"
git update-index --assume-unchanged "ios/Internals/ios/Internals.swift"
git update-index --assume-unchanged "ios/Internals/ios/Internals-Bridging-Header.h"
git update-index --assume-unchanged "ios/Extras.json"

# Specifying ONLY the node packages that we need to install via browserify
# (because those aren't available in react native) and some of our deps require them.
# If we don't specify which packages, rn-nodeify  will look into each package.json
# and install everything including a bunch devDeps that we don't need like "console"
rn-nodeify --install --hack 'crypto,buffer,react-native-randombytes,vm,stream,http,https,os,url,net,fs,process'
echo "✅ rn-nodeify packages hacked succesfully"

if [ -e .env ]
then
  source .env
  echo "✅ Android ENV vars exported"

else
  echo "⚠️ .env file missing!! ⚠️"
  echo "Please make sure the file exists and it's located in the root of the project"
fi

patch-package
echo "✅ All patches applied"

DEBUGFILE=src/config/debug.js
if test -f "$DEBUGFILE"; then
    echo "$DEBUGFILE exists."
else
    echo "$DEBUGFILE does not exist. You use default debug settings."
    cp src/config/defaultDebug.js $DEBUGFILE
fi

