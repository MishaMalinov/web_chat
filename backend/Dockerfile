# Use official PHP image with FPM
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    nodejs \
    npm \
    libpq-dev \  
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd pdo_pgsql  

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy Laravel project files
COPY . .

# Set correct permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Install PHP dependencies (Laravel)
RUN composer install --no-dev --optimize-autoloader

# Generate Laravel application key
# RUN php artisan key:generate

# Cache Laravel configuration
RUN php artisan config:cache

RUN php artisan storage:link


# Run database migrations
RUN php artisan migrate 

# Expose port for Laravel
EXPOSE 8000

# Start Laravel application
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]