FROM node:16.13.2-alpine

WORKDIR /usr/src/app

ARG env_encryption

RUN echo "code is ${env_encryption}"

COPY ./ ./

RUN apk update \
    && apk add openssl && openssl enc -d -aes-256-cbc -salt -k ${env_encryption} -in ./.env.deploy.enc -out ./.env && npm i --force && npm run build

EXPOSE 3000
 
 
CMD npm run start