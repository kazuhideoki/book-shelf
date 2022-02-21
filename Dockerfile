FROM node:16.13.2-alpine

WORKDIR /usr/src/app

COPY ./ ./

RUN npm i --force && npm run build

EXPOSE 3000

CMD npm run start