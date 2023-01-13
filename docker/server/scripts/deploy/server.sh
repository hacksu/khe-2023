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
    if [ -d "/var/www/nginx"]; then mv /var/www/nginx /var/www/old-nginx; fi
    if [ -d "includes"]; then mv includes old-includes; fi
    if [ -d "sites-enabled"]; then mv sites-enabled old-sites-enabled; fi

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
    if [ -d "/var/www/old-nginx"]; then rm -rf /var/www/old-nginx; fi
    if [ -d "/etc/nginx/old-includes"]; then rm -rf /etc/nginx/old-includes; fi
    if [ -d "/etc/nginx/old-sites-enabled"]; then rm -rf /etc/nginx/old-sites-enabled; fi
else
    nginx -t
    if [ -d "/etc/nginx/www"]; then rm -rf /etc/nginx/www; fi
    if [ -d "/etc/nginx/includes"]; then rm -rf /etc/nginx/includes; fi
    if [ -d "/etc/nginx/sites-enabled"]; then rm -rf /etc/nginx/sites-enabled; fi
    if [ -d "/var/www/old-nginx"]; then mv /var/www/old-nginx /var/www/nginx; fi
    if [ -d "old-includes"]; then mv old-includes includes; fi
    if [ -d "old-sites-enabled"]; then mv old-sites-enabled sites-enabled; fi
    exit 1
fi
