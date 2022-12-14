

server {
    listen 80;
    listen [::]:80;
    server_name dev.khe.io;
    return 302 https://$host$request_uri;
}

server {
    listen 80;
    listen [::]:80;
    server_name staff.dev.khe.io;
    return 302 https://$host$request_uri;
}


server {
    listen 443 ssl;
    server_name dev.khe.io;
    ssl_certificate "/root/.acme.sh/dev.khe.io/fullchain.cer";
    ssl_certificate_key "/root/.acme.sh/dev.khe.io/dev.khe.io.key";
    proxy_intercept_errors on;
    include includes/errors;
    include includes/api-proxy;
    include includes/web-proxy;
}

server {
    listen 443 ssl;
    server_name staff.dev.khe.io;
    ssl_certificate "/root/.acme.sh/dev.khe.io/fullchain.cer";
    ssl_certificate_key "/root/.acme.sh/dev.khe.io/dev.khe.io.key";
    proxy_intercept_errors on;
    include includes/errors;
    include includes/api-proxy;
    include includes/staff-proxy;
}



