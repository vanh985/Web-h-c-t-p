FROM node:20-alpine

WORKDIR /app

# Copy package files của backend
COPY backend/package*.json ./backend/

# Cài dependencies
RUN cd backend && npm ci --only=production && npm cache clean --force

# Copy toàn bộ source (backend + frontend)
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Tạo user non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 && \
    chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 3000

CMD ["node", "backend/server.js"]
