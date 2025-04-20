# Use Node.js 20 as the base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json, package-lock.json, and tsconfig.json
COPY package*.json tsconfig.json ./

# Install dependencies including production and development dependencies
RUN npm install

# Copy application source code
COPY . .

# Build TypeScript code
RUN npm run build

# Create a path-register.js file to handle module resolution
RUN echo 'const tsConfig = require("./tsconfig.json"); \n\
const tsConfigPaths = require("tsconfig-paths"); \n\
\n\
const baseUrl = "./dist"; \n\
const cleanup = tsConfigPaths.register({ \n\
  baseUrl, \n\
  paths: tsConfig.compilerOptions.paths \n\
});\n\
\n\
process.env.NODE_ENV = process.env.NODE_ENV || "production";' > path-register.js

# Install only production dependencies to reduce image size
RUN npm prune --production

# Keep tsconfig-paths as it's needed for runtime
RUN npm install --no-save tsconfig-paths

# Set environment variable for production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application with path registration
CMD ["node", "-r", "./path-register.js", "dist/src/cmd/main.js"]
