FROM node:16 as builder

# Set working directory
WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

# install node modules and build assets
RUN yarn
COPY . .
RUN yarn run build

# nginx state for serving content
FROM nginx:alpine
EXPOSE 3001
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/ /usr/share/nginx/html