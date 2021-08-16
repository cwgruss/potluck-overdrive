# --- Build Vue app ---
# --------------------------------------------
FROM node:16-alpine as build
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci

COPY . .

RUN npm run build

RUN npm ci --production