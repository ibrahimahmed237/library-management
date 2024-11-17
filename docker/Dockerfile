FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3030

WORKDIR /app/src

# Create startup script using RUN
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'npm run db:migrate' >> /app/start.sh && \
    echo 'npm run db:seed:all || true' >> /app/start.sh && \
    echo 'node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]