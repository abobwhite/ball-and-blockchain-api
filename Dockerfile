FROM node:6-onbuild

# Copy application files and set working dir
RUN mkdir -p /ball-and-blockchain-api
WORKDIR /ball-and-blockchain-api
COPY . /ball-and-blockchain-api
RUN npm set progress=false && npm install
RUN npm run build

EXPOSE 8080