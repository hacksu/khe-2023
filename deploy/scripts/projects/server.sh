#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );
PROJECT=server
PM2_NAME=khe-api


cd $REPO/projects/$PROJECT
if [ -d "dist-old" ]; then
    rm -rf dist-old;
fi
if [ -d "dist" ]; then
#   Move old dist folder
    mv dist dist-old
fi
cd $CWD

echo "building $PROJECT"
npm run build -- --only -vvv --filter=@kenthackenough/$PROJECT

cd $REPO/projects/$PROJECT
PWD=$( pwd );

if [ -d "dist" ]; then
#   Start the project
    if pm2 show $PM2_NAME; then
        echo "pm2: start $PM2_NAME"
        NODE_ENV=production pm2 restart $PM2_NAME --update-env
    else
        echo "pm2: initialize $PM2_NAME"
        cd $REPO
        pm2 start --name $PM2_NAME "npm run start -- --only --filter=@kenthackenough/$PROJECT"
        cd $PWD
    fi
    pm2 show $PM2_NAME
    rm -rf dist-old
else
    mv dist-old dist;
    exit 1
fi

cd $REPO/deploy/scripts
npm run nginx





# echo "building $PROJECT"
# npm run build -- --only -vvv --filter=@kenthackenough/$PROJECT -- --outDir ./dist-build

# cd $REPO/projects/$PROJECT

# if [ -d "dist-build" ]; then

# #   Move old dist folder
#     mv dist dist-old

# #   Copy over the new one
#     if mv dist-build dist; then
# #       Start the project
#         if pm2 show $PROJECT; then
#             echo "pm2: start $PROJECT"
#             NODE_ENV=production pm2 restart $PROJECT --update-env
#         else
#             echo "pm2: initialize $PROJECT"
#             pm2 start --name $PROJECT "npm run start -- --only --filter=@kenthackenough/$PROJECT"
#         fi
#         pm2 show $PROJECT
#         rm -rf dist-old
#     else
#         mv dist-old dist
#         echo "undo dist move"
#         exit 1
#     fi

# fi

