FROM node:17-alpine

WORKDIR /app
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install

## Allow for setting the user id when building
#  This will help us to run the workers as the correct user in production
ARG NODE_USER_ID=1000
RUN deluser --remove-home node \
  && addgroup -S node -g $NODE_USER_ID \
  && adduser -S -G node -u $NODE_USER_ID node
USER node

COPY . /app
