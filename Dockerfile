FROM node:24.15.0-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

CMD npm run commands && npm start