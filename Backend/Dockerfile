FROM php:8.3-cli

# Install dependencies yang dibutuhkan Laravel
RUN apt-get update -y && apt-get install -y \
    libzip-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo_mysql zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy semua file Laravel ke dalam container
COPY . .

# Install package Laravel
RUN composer install --ignore-platform-reqs

# Expose port 8000
EXPOSE 8000
