#!/bin/sh

# source ./.env
source ../../.env
# echo $PWD/../../$GOOGLE_APPLICATION_CREDENTIALS
GOOGLE_APPLICATION_CREDENTIALS=$PWD/../../$GOOGLE_APPLICATION_CREDENTIALS
# cd dist/routes

gcloud functions deploy screenshots --entry-point screenshots \
  --runtime nodejs14 --trigger-http --memory 4096MB --service-account \
  screenshots-api@breathecode-197918.iam.gserviceaccount.com --source . \
  --set-env-vars SCREENSHOT_PATH=$SCREENSHOT_PATH --set-env-vars \
  GOOGLE_CLOUD_PROJECT_ID=$GOOGLE_CLOUD_PROJECT_ID \
  --set-env-vars BUCKET_NAME=$BUCKET_NAME --project $GOOGLE_CLOUD_PROJECT_ID
