FROM node:10-alpine

RUN apk add --no-cache git
RUN apk add --no-cache python make g++

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT [ "node", "attempt.js"]
