#!/usr/bin/env bash

PATH_TO_APP='/src';
PATH=/home/ubuntu/bin:/home/ubuntu/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin

if [ $# -eq 0 ]
then
    echo "Please, provide PATH TO APPLICATION"
    exit 1;
fi
PATH_TO_APP=$1;

GIT_PULL_RESULT="$(cd $PATH_TO_APP && git pull)"

if [ "$GIT_PULL_RESULT" == "Already up-to-date." ]
then
    echo $GIT_PULL_RESULT;
    exit 0;
fi

cd $PATH_TO_APP/docker && ./run.sh staging

