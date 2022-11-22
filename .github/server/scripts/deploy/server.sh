#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );
PROJECT=server

echo "building $PROJECT"
npm run build -- --only --filter=@kenthackenough/$PROJECT -- --outDir ./dist-build

cd $REPO/projects/$PROJECT

source $REPO/.github/server/scripts/utils/nginx.sh
enable_offline_page /etc/nginx/includes/api-proxy;

# Move old dist folder
mv dist dist-old

# include includes/errors/offline;

# Copy over the new one
if mv dist-build dist; then
#   Start the project
    if pm2 show $PROJECT; then
        echo "pm2: start $PROJECT"
        NODE_ENV=production pm2 restart $PROJECT --update-env
    else
        echo "pm2: initialize $PROJECT"
        pm2 start --name $PROJECT "npm run start -- --only --filter=@kenthackenough/$PROJECT"
    fi
    pm2 show $PROJECT
    rm -rf dist-old

#   NGINX
    mkdir -p /etc/nginx/includes
    mkdir -p /etc/nginx/www
    cd /etc/nginx
    mv /var/www/nginx /var/www/old-nginx
    mv includes old-includes
    mv sites-enabled old-sites-enabled
    cp -R $REPO/.github/server/nginx/www /var/www/nginx
    cp -R $REPO/.github/server/nginx/includes /etc/nginx/includes
    cp -R $REPO/.github/server/nginx/sites-enabled /etc/nginx/sites-enabled
    chmod 755 -R /var/www/nginx
    if nginx -t; then
        rm -rf /var/www/old-nginx
        rm -rf /etc/nginx/old-includes
        rm -rf /etc/nginx/old-sites-enabled
        service nginx reload
    else
        nginx -t
        rm -rf /etc/nginx/www
        rm -rf /etc/nginx/includes
        rm -rf /etc/nginx/sites-enabled
        mv /var/www/old-nginx /var/www/nginx
        mv old-includes includes
        mv old-sites-enabled sites-enabled
        exit 1
    fi
else
    disable_offline_page /etc/nginx/includes/api-proxy;
    mv dist-old dist
    exit 1
fi
