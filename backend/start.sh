#!/bin/sh

echo "Running Laravel setup..."

# php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link

echo "Starting Laravel HTTP server on port 0.0.0.0:8000..."
php artisan serve --host=0.0.0.0 --port=8000
