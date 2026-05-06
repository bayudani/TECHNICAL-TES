FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file Next.js ke dalam container
COPY . .

# Expose port 3000
EXPOSE 3000

# Jalankan development server Next.js
CMD ["npm", "run", "dev"]
