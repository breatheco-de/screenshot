#!/usr/bin/env sh

callJust() {
  curl -X GET "http://us-central1-breathecode-197918.cloudfunctions.net/screenshots/?url=$1&dimension=6000x6000&name=thus-spoke-kishibe-rohan" -H "Content-Type:application/json"
  echo ------
  echo ------
  echo ------
}

# call() {
#   callJust $1 & callJust $1 & callJust $1 & callJust $1 & callJust $1 & \
#     callJust $1 & callJust $1 & callJust $1 & callJust $1 & callJust $1 & wait
# }

call() {
  echo START $1
  echo ------
  callJust $1 & callJust $1 & callJust $1 & callJust $1 & callJust $1 & \
     callJust $1 & callJust $1 & callJust $1 & callJust $1 & callJust $1 \
     callJust $1 & callJust $1 & callJust $1 & callJust $1 & callJust $1 \
     callJust $1 & callJust $1 & callJust $1 & callJust $1 & callJust $1 \
     wait
  echo -
  echo -
  echo -
  echo -
  echo -
}

call https%3A%2F%2Fwww.google.com%2Fsearch%3Fclient%3Dopera%26q%3Djavascript%2Burl%2Bdecode%26sourceid%3Dopera%26ie%3DUTF-8%26oe%3DUTF-8
call www.google.com
call netflix.com/browse/my-list
call www.facebook.com
call github.com
call https%3A%2F%2Fwww.django-rest-framework.org%2Fapi-guide%2Fserializers%2F%23validation
