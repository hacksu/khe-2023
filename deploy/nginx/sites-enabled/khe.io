

server {
    listen 80;
    listen [::]:80;
    server_name khe.io dev.khe.io staff.khe.io staff.dev.khe.io;
    return 302 https://$host$request_uri;
}


server {
    listen 443 ssl;
    server_name khe.io dev.khe.io;
    include includes/ssl/khe.io;
    proxy_intercept_errors on;
    include includes/khe/errors;
    include includes/khe/proxy-api;
    include includes/khe/proxy-web;
}


server {
    listen 443 ssl;
    server_name staff.khe.io staff.dev.khe.io;
    include includes/ssl/khe.io;
    proxy_intercept_errors on;
    include includes/khe/errors;
    include includes/khe/proxy-api;
    include includes/khe/proxy-staff;
}