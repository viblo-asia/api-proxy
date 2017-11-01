FROM keymetrics/pm2:8

ENV NODE_ENV=production
ENV PORT=3000

COPY index.js /srv/index.js
COPY package.json /srv/package.json
COPY package-lock.json /srv/package-lock.json
COPY pm2.json /srv/pm2.json
COPY src /srv/src

WORKDIR /srv

RUN npm install
RUN npm cache clean --force

EXPOSE 3000
CMD ["pm2-docker", "start", "pm2.json"]
