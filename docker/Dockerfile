FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3030

WORKDIR /app/src

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'cd /app && npx knex migrate:latest && npx knex seed:run --specific=01_cleanup.js && npx knex seed:run && cd /app/src && node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]