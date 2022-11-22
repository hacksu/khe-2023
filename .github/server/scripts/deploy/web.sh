#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );
PROJECT=web

echo "building $PROJECT"
BUILD_DIR=.next-build npm run build -- --only --filter=@kenthackenough/$PROJECT

cd $REPO/projects/$PROJECT

#source $REPO/.github/server/scripts/utils/nginx.sh
#enable_offline_page '/etc/nginx/includes/web-proxy';

# Move old dist folder
mv .next .next-old

# Copy over the new one
if mv .next-build .next; then
#   Start the project
    if pm2 show $PROJECT; then
        echo "pm2: start $PROJECT"
        NODE_ENV=production pm2 restart $PROJECT --update-env
    else
        echo "pm2: initialize $PROJECT"
        pm2 start --name $PROJECT "npm run start -- --only --filter=@kenthackenough/$PROJECT"
    fi
    pm2 show $PROJECT
#    disable_offline_page '/etc/nginx/includes/web-proxy';
    rm -rf .next-old
else
#    disable_offline_page '/etc/nginx/includes/web-proxy';
    mv .next-old .next
    exit 1
fi
