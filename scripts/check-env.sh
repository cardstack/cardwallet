#!/bin/bash

BLUE="\033[1;34m"
DEFAULT='\033[0m' 

set -eo pipefail
source .env

echo "👀 Checking env vars..."
if [[ "$ENABLE_DEV_MODE" = '1' || "$IS_TESTING" = 'true' ]]; then 
    echo "❌ Invalid ENV var value for production build: IS_TESTING = ${IS_TESTING} or ENABLE_DEV_MODE = ${$ENABLE_DEV_MODE}";
    exit 1;
else
  if [ -n "$ANDROID_KEYSTORE_PASSWORD" -a -n "$ANDROID_KEY_PASSWORD" -a -n "$ANDROID_KEYSTORE_ALIAS" ]; then
    echo "✅ Env vars are valid";
  else 
     echo -e "❌ Android release ENV vars not set! Run ${BLUE}>>> yarn contexts:app:sync <<< ${DEFAULT}to download.";
     exit 1;
  fi
fi