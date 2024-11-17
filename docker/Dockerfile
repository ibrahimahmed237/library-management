FROM node:18

WORKDIR /app

# Install netcat for connection testing
RUN apt-get update && apt-get install -y netcat-openbsd

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3030

# Create startup script with proper waiting and initialization
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Waiting for MySQL to be ready..."' >> /app/start.sh && \
    echo 'node /app/migrations/init-db.js' >> /app/start.sh && \
    echo 'if [ $? -eq 0 ]; then' >> /app/start.sh && \
    echo '  echo "Database initialized successfully"' >> /app/start.sh && \
    echo '  cd /app && npx knex migrate:latest' >> /app/start.sh && \
    # echo '  cd /app && npx knex seed:run --specific=01_cleanup.js' >> /app/start.sh && \
    echo '  cd /app && npx knex seed:run' >> /app/start.sh && \
    echo '  cd /app/src && node server.js' >> /app/start.sh && \
    echo 'else' >> /app/start.sh && \
    echo '  echo "Database initialization failed"' >> /app/start.sh && \
    echo '  exit 1' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]