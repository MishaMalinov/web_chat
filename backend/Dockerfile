# Use official PHP image with FPM
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www

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

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# Ensure needed directories exist
RUN mkdir -p storage/app/public bootstrap/cache \
    && chmod -R 755 storage bootstrap/cache

# Copy and allow start.sh to run
COPY start.sh /var/www/start.sh
RUN chmod +x /var/www/start.sh

# Expose the default port for PHP-FPM
EXPOSE 9000

# Start container by running Laravel setup and php-fpm
CMD ["/var/www/start.sh"]
