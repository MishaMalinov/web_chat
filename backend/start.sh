#!/bin/sh

# Run Laravel setup commands
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link

# Start PHP-FPM
php-fpm
