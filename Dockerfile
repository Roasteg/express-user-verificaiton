FROM node:21-alpine

RUN mkdir /app/
WORKDIR /app/

ENV NODE_ENV=test

COPY package.json tsconfig-paths-bootstrap.js eslint.config.ts tsconfig.json .env.* /app/
RUN yarn

COPY src/ /app/

EXPOSE 8000
CMD [ "yarn", "dev" ]