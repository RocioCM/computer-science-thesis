# Use Node.js 20 as the base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json, package-lock.json, and tsconfig.json
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Build TypeScript code
RUN npm run build

# Create a path-register.js file to handle module resolution
RUN echo "const tsConfig = require('./tsconfig.json'); const tsConfigPaths = require('tsconfig-paths'); const baseUrl = './dist'; tsConfigPaths.register({ baseUrl, paths: tsConfig.compilerOptions.paths });" > path-register.js

# Remove development dependencies to reduce image size
RUN npm prune --production

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application with path registration
CMD ["node", "-r", "./path-register.js", "dist/src/cmd/main.js"]
