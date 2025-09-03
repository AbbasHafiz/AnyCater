# ---- Build frontend ----
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ .
RUN npm run build

# ---- Build backend ----
FROM node:18-alpine
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --legacy-peer-deps

# Copy backend code
COPY backend ./backend

# Copy built frontend into backend/public
COPY --from=frontend-builder /app/frontend/build ./backend/public

WORKDIR /app/backend
EXPOSE 3000

CMD ["npm", "start"]
