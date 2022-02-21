FROM node:16.13.2-alpine

WORKDIR /usr/src/app

COPY ./ ./

RUN wget https://www.openssl.org/source/openssl-1.1.1m.tar.gz -O - | tar -xz
RUN openssl enc -d -aes-256-cbc -salt -k _ENV_ENCRIPTION -in ./.env.enc.deploy -out ./.env && npm i --force && npm run build

EXPOSE 3000

CMD npm run start