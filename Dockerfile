# syntax=docker/dockerfile:1

FROM node:16-alpine as builder

WORKDIR /usr/src/app

# g++ make python3 required by node-gyp
RUN apk add --no-cache g++ make python3

COPY package*.json /usr/src/app/
RUN npm install

COPY . .
RUN npm prune --production

FROM node:16-alpine as final

WORKDIR /app/src/app

COPY --from=builder --chown=node:node /usr/src/app ./

EXPOSE 3000

CMD ["node", "server.js"]
