FROM node:alpine
RUN npm install --global nodemon
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 1337

CMD [ "npm", "run", "dev" ]