#!/bin/bash
yarn build
zip -r build.zip build 
rm -rf build