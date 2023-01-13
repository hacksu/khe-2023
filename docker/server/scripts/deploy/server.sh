#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );
PROJECT=server

echo "building $PROJECT"
npm run build -- --only -vvv --filter=@kenthackenough/$PROJECT -- --outDir ./dist-build

cd $REPO/projects/$PROJECT

if [ -d "dist-build" ]; then

#   Move old dist folder
    mv dist dist-old

#   Copy over the new one
    if mv dist-build dist; then
#       Start the project
        if pm2 show $PROJECT; then
            echo "pm2: start $PROJECT"
            NODE_ENV=production pm2 restart $PROJECT --update-env
        else
            echo "pm2: initialize $PROJECT"
            pm2 start --name $PROJECT "npm run start -- --only --filter=@kenthackenough/$PROJECT"
        fi
        pm2 show $PROJECT
        rm -rf dist-old
    else
        mv dist-old dist
        echo "undo dist move"
        exit 1
    fi

fi


cd /etc/nginx

if [ ! -d "/etc/nginx/old-nginx" ]; then
    echo "backing up nginx"

    mkdir -p /etc/nginx/includes
    mkdir -p /etc/nginx/www
    [ -d "/var/www/nginx"] && mv /var/www/nginx /var/www/old-nginx
    [ -d "includes"] && mv includes old-includes
    [ -d "sites-enabled"] && mv sites-enabled old-sites-enabled

else
    echo "?? nginx already backed up!"
fi

echo "copying nginx configuration from $REPO/docker/server/nginx to /var/www/nginx"
cp -R $REPO/docker/server/nginx/www /var/www/nginx
cp -R $REPO/docker/server/nginx/includes /etc/nginx/includes
cp -R $REPO/docker/server/nginx/sites-enabled /etc/nginx/sites-enabled
chmod 755 -R /var/www/nginx

echo "testing nginx"
if nginx -t; then
    echo "reloading nginx"
    service nginx reload
    [ -d "/var/www/old-nginx"] && rm -rf /var/www/old-nginx;
    [ -d "/etc/nginx/old-includes"] && rm -rf /etc/nginx/old-includes;
    [ -d "/etc/nginx/old-sites-enabled"] && rm -rf /etc/nginx/old-sites-enabled;
else
    nginx -t
    [ -d "/etc/nginx/www"] && rm -rf /etc/nginx/www;
    [ -d "/etc/nginx/includes"] && rm -rf /etc/nginx/includes;
    [ -d "/etc/nginx/sites-enabled"] && rm -rf /etc/nginx/sites-enabled;
    [ -d "/var/www/old-nginx"] && mv /var/www/old-nginx /var/www/nginx;
    [ -d "old-includes"] && mv old-includes includes;
    [ -d "old-sites-enabled"] && mv old-sites-enabled sites-enabled;
    exit 1
fi
