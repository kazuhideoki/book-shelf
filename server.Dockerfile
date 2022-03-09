FROM node:16.13.2-alpine

WORKDIR /usr/src/app

COPY ./server ./
COPY ./type ./

RUN npm i --force && npm run build

EXPOSE 8080

CMD npm run start:prod