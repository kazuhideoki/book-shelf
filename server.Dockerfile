FROM node:16.13.2-alpine

WORKDIR /usr/src/app

COPY ./server ./server
COPY ./type ./type

RUN cd server && npm i --force && npm run build

EXPOSE 8080

CMD cd server && npm run start:prod