FROM node:16.13.2-alpine

WORKDIR /usr/src/app

COPY ./ ./

RUN openssl enc -d -aes-256-cbc -salt -k _ENV_ENCRIPTION -in ./.env.enc.deploy -out ./.env && npm i --force && npm run build

EXPOSE 3000

CMD npm run start