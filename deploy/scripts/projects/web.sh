#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );
PROJECT=web
PM2_NAME=khe-web


cd $REPO/projects/$PROJECT
if [ -d ".next-old" ]; then
    rm -rf .next-old;
fi
if [ -d ".next" ]; then
#   Move old dist folder
    mv .next .next-old
fi
cd $CWD

echo "building $PROJECT"
npm run build -- --only -vvv --filter=@kenthackenough/$PROJECT

cd $REPO/$PROJECT
PWD=$( pwd );

if [ -d ".next" ]; then
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
    rm -rf .next-old
else
    mv .next-old .next;
    exit 1
fi





# echo "building $PROJECT"
# BUILD_DIR=.next-build npm run build -- --only -vvv --filter=@kenthackenough/$PROJECT

# cd $REPO/repos/templates/web
# PWD=$( pwd );

# if [ -d ".next-build" ]; then

#     # Move old dist folder
#     mv .next .next-old

#     # Copy over the new one
#     if mv .next-build .next; then
#     #   Start the project
#         if pm2 show $PROJECT; then
#             echo "pm2: start $PROJECT"
#             NODE_ENV=production pm2 restart $PROJECT --update-env
#         else
#             echo "pm2: initialize $PROJECT"
#             cd $REPO
#             pm2 start --name $PROJECT "npm run start -- --only --filter=@kenthackenough/$PROJECT"
#             cd $PWD
#         fi
#         pm2 show $PROJECT
#         rm -rf .next-old
#     else
#         mv .next-old .next
#         exit 1
#     fi

# fi
