FROM node:16.13.2-alpine


WORKDIR /usr/src/app

ARG _ENV_ENCRIPTION

COPY ./ ./

RUN apk update \
    && apk add openssl && openssl enc -d -aes-256-cbc -salt -k $_ENV_ENCRIPTION -in ./.env.deploy.enc -out ./.env && npm i --force && npm run build

EXPOSE 3000

CMD npm run start