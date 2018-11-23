FROM keymetrics/pm2:10-alpine

WORKDIR /proxy

ENV NODE_ENV=production
ENV PORT=3000

COPY package.json yarn.lock ./

RUN yarn --production --frozen-lockfile && yarn cache clean

COPY . .

EXPOSE 3000

CMD ["pm2-docker", "start", "pm2.config.js"]
