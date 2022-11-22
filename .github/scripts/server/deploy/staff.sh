#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );
PROJECT=staff

echo "building $PROJECT"
BUILD_DIR=.next-build npm run build -- --only --filter=@kenthackenough/staff

cd $REPO/projects/$PROJECT

# Stop the project
if pm2 show $PROJECT; then
    echo "pm2: stop $PROJECT"
#    pm2 stop $PROJECT
fi

# Erase old build folder
rm -rf .next

# Copy over the new one
if mv .next-build .next; then
    cd $REPO
#   Start the project
    if pm2 show $PROJECT; then
        echo "pm2: start $PROJECT"
#        pm2 start $PROJECT
    else
        echo "pm2: initialize $PROJECT"
#        pm2 start --name $PROJECT "npm run start -- --only --filter=@kenthackenough/$PROJECT"
    fi
#    pm2 show $PROJECT
fi
