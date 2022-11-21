#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );
PROJECT=server

echo "building $PROJECT"
npm run build -- --only --filter=@kenthackenough/$PROJECT -- --outDir ./dist-build

cd $REPO/projects/$PROJECT

# Stop the server
pm2 stop server

# Erase old dist folder
rm -rf dist

# Copy over the new one
if mv dist-build dist; then
    cd $REPO
#   Start the project
    if pm2 show $PROJECT; then
        pm2 start $PROJECT
    else
        pm2 start --name $PROJECT "npm run start -- --only --filter=@kenthackenough/$PROJECT"
    fi
    pm2 show $PROJECT
fi
