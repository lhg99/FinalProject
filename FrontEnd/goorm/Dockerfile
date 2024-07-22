# Stage 1: Build the React application
FROM node:alpine as builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY ./package.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set build-time environment variables
ARG REACT_APP_API_REQUEST_URL
ARG REACT_APP_WEBSOCKET_SUB_URL
ARG REACT_APP_WEBSOCKET_PUB_URL

# Ensure the environment variables are available during build
ENV REACT_APP_API_REQUEST_URL=${REACT_APP_API_REQUEST_URL}
ENV REACT_APP_WEBSOCKET_SUB_URL=${REACT_APP_WEBSOCKET_SUB_URL}
ENV REACT_APP_WEBSOCKET_PUB_URL=${REACT_APP_WEBSOCKET_PUB_URL}

# Build the React application
RUN npm run build

# Stage 2: Serve the React application with Nginx
FROM nginx

# Expose port 3000
EXPOSE 3000

# Copy Nginx configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html


# FROM node:alpine as builder
# WORKDIR /app
# COPY ./package.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# FROM nginx
# EXPOSE 3000 
# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# COPY --from=builder /app/build  /usr/share/nginx/html

