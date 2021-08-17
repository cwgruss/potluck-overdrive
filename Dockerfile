# --- 1. Build Vue app ---
# --------------------------------------------
FROM node:16 as ui

WORKDIR /app

COPY ["./packages/ui/package.json", "./packages/ui/package-lock.json*", "./"]

RUN npm ci

COPY ./packages/ui .

RUN npm run build

RUN npm ci --production

# --- Node Build ---
# --------------------------------------------
FROM node:16 as build

WORKDIR /app

COPY ["./packages/server/package.json", "./packages/server/package-lock.json*", "./"]

RUN npm ci

COPY ./packages/server .

RUN npm run build

RUN npm ci --production


# --- 2. Build Web App ---
# --------------------------------------------
FROM node:16 as web
ENV NODE_ENV=production
USER node 

WORKDIR /app

#///// Copy from server build ///////
COPY --from=build --chown=node:node  /app/node_modules /app/node_modules
COPY --from=build --chown=node:node /app/dist /app/

#///// Copy from UI build ///////
COPY --from=ui --chown=node:node /app/dist /app/public


CMD [ "node", "main.js" ]