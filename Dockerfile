FROM node:10-alpine

WORKDIR /proxy

ENV NODE_ENV=production
ENV PORT=3000

COPY package.json yarn.lock ./

COPY . .

RUN yarn --production --frozen-lockfile && yarn cache clean

EXPOSE 3000

CMD ["yarn", "start"]
