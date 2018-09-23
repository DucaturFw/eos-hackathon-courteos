#!/bin/bash

CURRENT_PATH=$PWD
BUILD_PATH=$CURRENT_PATH/build

mkdir -p $BUILD_PATH/contracts


# Generate ABI for contracts
eosiocpp -g $BUILD_PATH/contracts/courteos.abi $CURRENT_PATH/contracts/courteos.cpp

# Compile contracts to WASM
eosiocpp -o $BUILD_PATH/contracts/courteos.wast $CURRENT_PATH/contracts/courteos.cpp