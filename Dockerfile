# -------------> Install dependencies
FROM node:latest AS DEPS_INSTALLER

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .

RUN npm install

# --------------> run application
# image@digest
FROM node:18-bullseye AS deploy

WORKDIR /usr/app

RUN chown -R node:node /usr/app && chmod -R 755 /usr/app

ENV NODE_ENV production

COPY --chown=node:node --from=DEPS_INSTALLER /usr/app/node_modules ./node_modules

COPY --chown=node:node package.json .
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node ./src ./src
COPY --chown=node:node ./test ./test

USER node

CMD ["npm" ,"run", "start:debug"]