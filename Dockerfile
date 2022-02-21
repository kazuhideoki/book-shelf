FROM node:16.13.2-alpine

ARG URL_SOURCE0="https://vault.centos.org/8.4.2105/BaseOS/Source/SPackages/openssl-1.1.1g-15.el8_3.src.rpm"

# Openssl srpmダウンロード
RUN wget $URL_SOURCE0

# Openssl srpmインストール
RUN rpm -ivf openssl-1.1.1g-15.el8_3.src.rpm


WORKDIR /usr/src/app

# srpmからOpensslをビルド
RUN rpmbuild -bb openssl.spec

COPY ./ ./

RUN openssl enc -d -aes-256-cbc -salt -k _ENV_ENCRIPTION -in ./.env.enc.deploy -out ./.env && npm i --force && npm run build

EXPOSE 3000

CMD npm run start