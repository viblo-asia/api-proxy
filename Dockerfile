FROM node:8-alpine

ENV NODE_ENV=production
ENV PORT=3000

ADD . /srv

WORKDIR /srv

RUN npm install
RUN npm cache clean --force

EXPOSE 3000
CMD ["npm", "run", "start"]
