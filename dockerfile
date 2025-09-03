# Use official Node.js image
FROM node:18-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Build step (if you have React frontend, etc.)
# RUN npm run build

# -----------------------------
# Production Stage
# -----------------------------
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app /app

# Expose app port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
