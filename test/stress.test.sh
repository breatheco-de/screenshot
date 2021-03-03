#!/usr/bin/env sh

callMoreOfSix() {
  echo MORE OF SIX $1
  echo ------
  curl -X GET "http://us-central1-breathecode-197918.cloudfunctions.net/screenshots/?url=$1&dimension=6000x6000,5000x5000,4000x4000,3000x3000,2000x2000,1000x1000,900x900,800x800&name=thus-spoke-kishibe-rohan" -H "Content-Type:application/json"
  echo -
  echo -
  echo -
  echo -
  echo -
}

callOne() {
  echo ONE $1
  echo ------
  curl -X GET "http://us-central1-breathecode-197918.cloudfunctions.net/screenshots/?url=$1&dimension=6000x6000&name=thus-spoke-kishibe-rohan" -H "Content-Type:application/json"
  echo -
  echo -
  echo -
  echo -
  echo -
}

callTwo() {
  echo TWO $1
  echo ------
  curl -X GET "http://us-central1-breathecode-197918.cloudfunctions.net/screenshots/?url=$1&dimension=6000x6000,5000x5000&name=thus-spoke-kishibe-rohan" -H "Content-Type:application/json"
  echo -
  echo -
  echo -
  echo -
  echo -
}

callThree() {
  echo THREE $1
  echo ------
  curl -X GET "http://us-central1-breathecode-197918.cloudfunctions.net/screenshots/?url=$1&dimension=6000x6000,5000x5000,4000x4000&name=thus-spoke-kishibe-rohan" -H "Content-Type:application/json"
  echo -
  echo -
  echo -
  echo -
  echo -
}

callFour() {
  echo FOUR $1
  echo ------
  curl -X GET "http://us-central1-breathecode-197918.cloudfunctions.net/screenshots/?url=$1&dimension=6000x6000,5000x5000,4000x4000,3000x3000&name=thus-spoke-kishibe-rohan" -H "Content-Type:application/json"
  echo -
  echo -
  echo -
  echo -
  echo -
}

callFive() {
  echo FIVE $1
  echo ------
  curl -X GET "http://us-central1-breathecode-197918.cloudfunctions.net/screenshots/?url=$1&dimension=6000x6000,5000x5000,4000x4000,3000x3000,2000x2000&name=thus-spoke-kishibe-rohan" -H "Content-Type:application/json"
  echo -
  echo -
  echo -
  echo -
  echo -
}

callSix() {
  echo SIX $1
  echo ------
  curl -X GET "http://us-central1-breathecode-197918.cloudfunctions.net/screenshots/?url=$1&dimension=6000x6000,5000x5000,4000x4000,3000x3000,2000x2000,1000x1000&name=thus-spoke-kishibe-rohan" -H "Content-Type:application/json"
  echo -
  echo -
  echo -
  echo -
  echo -
}

call() {
  callOne $1
  callTwo $1
  callThree $1
  callFour $1
  callFive $1
  callSix $1
  callMoreOfSix $1
}

call https%3A%2F%2Fwww.google.com%2Fsearch%3Fclient%3Dopera%26q%3Djavascript%2Burl%2Bdecode%26sourceid%3Dopera%26ie%3DUTF-8%26oe%3DUTF-8
call www.google.com
call netflix.com/browse/my-list
call www.facebook.com
call github.com
call https%3A%2F%2Fwww.django-rest-framework.org%2Fapi-guide%2Fserializers%2F%23validation
