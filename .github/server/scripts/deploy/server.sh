#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );
PROJECT=server

echo "building $PROJECT"
npm run build -- --only --filter=@kenthackenough/$PROJECT -- --outDir ./dist-build

cd $REPO/projects/$PROJECT

# Move old dist folder
mv dist dist-old

# Copy over the new one
if mv dist-build dist; then
    cd $REPO
#   Start the project
    if pm2 show $PROJECT; then
        echo "pm2: start $PROJECT"
        pm2 restart $PROJECT
    else
        echo "pm2: initialize $PROJECT"
        pm2 start --name $PROJECT "npm run start -- --only --filter=@kenthackenough/$PROJECT"
    fi
    pm2 show $PROJECT
    rm -rf dist-old
else
    mv dist-old dist
    exit 1
fi
