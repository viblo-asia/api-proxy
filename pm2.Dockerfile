FROM keymetrics/pm2:8-alpine

WORKDIR /srv

ENV NODE_ENV=production
ENV PORT=3000

COPY package.json yarn.lock ./
COPY index.js pm2.config.js src ./
COPY src ./src

RUN yarn --production --frozen-lockfile && yarn cache clean

EXPOSE 3000

CMD ["pm2-docker", "start", "pm2.config.js"]
