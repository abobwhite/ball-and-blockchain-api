FROM node:6-onbuild

ADD package.json /tmp/package.json
RUN cd /tmp && npm set progress=false && npm install
RUN mkdir -p /ball-and-blockchain-api && cp -a /tmp/node_modules /ball-and-blockchain-api

WORKDIR /ball-and-blockchain-web
ADD . /ball-and-blockchain-web

RUN npm run build

EXPOSE 8080