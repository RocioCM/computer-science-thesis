# Use Node.js 20 as the base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Build TypeScript code
RUN npm run build

# Remove development dependencies to reduce image size
RUN npm prune --production

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "dist/src/cmd/main.js"]
