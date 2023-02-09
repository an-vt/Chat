FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
EXPOSE 1337
CMD [ "npm", "start" ]