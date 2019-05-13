FROM node:12.2.0-alpine

RUN apk add yarn

ENV NODE_ENV=production

COPY . /usr/app/
WORKDIR /usr/app
RUN yarn

CMD ["yarn", "start"]
EXPOSE 3000