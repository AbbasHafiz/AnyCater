# ---- Stage 1: Build frontend ----
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

# Copy frontend source code and build
COPY frontend/ .
RUN npm run build

# ---- Stage 2: Build backend and combine ----
FROM node:18-alpine
WORKDIR /app

# Copy backend package files and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --legacy-peer-deps

# Copy backend source code
COPY backend ./backend

# Copy built frontend into backend/public
COPY --from=frontend-builder /app/frontend/build ./backend/public

# Set working directory to backend
WORKDIR /app/backend

# Expose application port
EXPOSE 3000

# Start the backend server
CMD ["npm", "start"]
