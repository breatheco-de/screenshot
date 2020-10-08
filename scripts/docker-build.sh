#!/bin/sh

COMPANY=stcsolutions
APP=screenshot

build() {
  docker build ./ \
    --rm=false \
    -t $COMPANY/$APP
}

build
