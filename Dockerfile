# --- 1. Build Vue app ---
# --------------------------------------------
FROM node:16 as ui

ENV VUE_APP_FIREBASE_API_KEY=""
ENV VUE_APP_FIREBASE_AUTH_DOMAIN=""
ENV VUE_APP_FIREBASE_PROJECT_ID=""
ENV VUE_APP_FIREBASE_STORAGE_BUCKET=""
ENV VUE_APP_FIREBASE_MESSAGING_SENDER_ID=""
ENV VUE_APP_FIREBASE_APP_ID=""
ENV VUE_APP_FIREBASE_MEASUREMENT_ID=""
ENV VUE_APP_SLACK_CLIENT_ID=""

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