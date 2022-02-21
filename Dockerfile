FROM node:14.17.4-alpine

WORKDIR /usr/src/app

COPY ./ ./

RUN npm i && npm run build

EXPOSE 3000

CMD npm run start