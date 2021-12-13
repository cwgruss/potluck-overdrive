# --- Node Build ---
# --------------------------------------------
FROM node:16-alpine as build
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci

COPY . .

RUN npm run build

RUN npm ci --production


# --- Server Image ---
# --------------------------------------------
FROM node:16 as production
ENV NODE_ENV=production
USER node 

RUN npm install pm2 -g

WORKDIR /app

COPY --from=build --chown=node:node  /app/node_modules /app/node_modules
COPY --from=build --chown=node:node /app/dist /app/


CMD ["pm2-runtime", "main.js"]
