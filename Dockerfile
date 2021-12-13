# --- Node API Build ---
# --------------------------------------------
FROM node:16 as build

WORKDIR /app

COPY ["./packages/api/package.json", "./packages/api/package-lock.json*", "./"]

RUN npm ci

COPY ./packages/api .

RUN npm run build

RUN npm ci --production


# --- 2. Build Web App ---
# --------------------------------------------
FROM node:16 as app

ENV NODE_ENV=production

USER node 

WORKDIR /app

#///// Copy from server build ///////
COPY --from=build --chown=node:node  /app/node_modules /app/node_modules
COPY --from=build --chown=node:node /app/dist /app/

RUN chown -R node:node /app/node_modules

CMD ["npx", "pm2-runtime", "main.js"]