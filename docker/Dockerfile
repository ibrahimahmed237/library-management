# Use node:lts-alpine as a base image
FROM node:lts-alpine

# Set working directory
WORKDIR /home/library_management/

# Install dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh curl

# Clone the repository
RUN git clone https://github.com/ibrahimahmed237/library-management.git

WORKDIR /home/library_management/library-management/

# Install project dependencies
RUN npm install

# Install sequelize-cli globally
RUN npm install -g sequelize-cli

# Run migrations and seeders
RUN npm run db:migrate || true && \
    npm run db:seed:all || true

# Expose port 3030
EXPOSE 3030

# Start server with a modified command for startup sequence
CMD /bin/bash -c '\
    cd src && \
    git fetch && \
    git reset --hard origin && \
    npm install && \
    sequelize db:migrate && \
    sequelize db:seed:all && \
    node server.js'
