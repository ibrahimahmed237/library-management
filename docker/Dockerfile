# Use node:lts-alpine as a base image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Install dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh curl


# Copy the rest of the application
COPY . .

# Install project dependencies
RUN npm install

# Install sequelize-cli globally
RUN npm install -g sequelize-cli



# Create necessary directories if they don't exist
RUN mkdir -p sequelize-migrations/migrations sequelize-migrations/seeders

# Run migrations and seeders
RUN npm run db:migrate || true && \
    npm run db:seed:all || true

# Expose port 3030
EXPOSE 3030

# Start server
CMD ["node", "src/server.js"]