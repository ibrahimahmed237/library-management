FROM node:18

# Create required directories
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 3030
EXPOSE 3030

WORKDIR /app/src

CMD ["sh", "-c", "npm run db:create && npm run db:seed:undo:all && npm run db:migrate:undo:all  && npm run db:migrate && npm run db:seed:all && node server.js"]

# CMD ["sh", "-c", "npm run db:create && npm run db:migrate && npm run db:seed:all && node server.js"]