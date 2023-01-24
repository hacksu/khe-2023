#!/bin/bash

NGINX_INCLUDE_OFFLINE="include includes/errors/offline;"

function enable_offline_page {
    file=$1;
    line=$NGINX_INCLUDE_OFFLINE;
    # Add Line
    grep -qxF "$line" $file || sed -i "1i $line" $file
    if nginx -t; then
        service nginx reload;
    else
        # Remove Line
        grep -qxF "$line" $file && sed -i "/$line/d" $file
    fi;
}

function disable_offline_page {
    file=$1;
    line=$NGINX_INCLUDE_OFFLINE;
    # Remove Line
    grep -qxF "$line" $file && sed -i "/$line/d" $file
    if nginx -t; then
        service nginx reload;
    else
        # Add Line
        grep -qxF "$line" $file || sed -i "1i $line" $file
    fi;
}

# grep -qxF "hello" what.txt || sed -i "1i hello" what.txt

# grep -qxF "hello" what.txt && sed -i '/hello/d' what.txt