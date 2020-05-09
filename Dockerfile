FROM node:13-alpine

WORKDIR /home/node/app
ADD package*.json ./
ADD yarn.lock ./

RUN yarn install

ADD . .
RUN yarn build

USER node

ENTRYPOINT ["node", "build/index.js"]