FROM node:20-alpine

WORKDIR /app

# Copy package files trước để tận dụng Docker layer cache
COPY package*.json ./

# Chỉ cài production dependencies (express)
RUN npm ci --only=production && npm cache clean --force

# Copy toàn bộ source code
COPY . .

# Tạo user non-root để bảo mật
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 && \
    chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 3000

CMD ["node", "server.js"]
