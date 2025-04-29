FROM node:20-alpine as dev-deps
WORKDIR /app
COPY package.json package.json
RUN npm install

FROM node:20-alpine as prod-deps
WORKDIR /app
COPY package.json package.json
RUN npm install --only=prod

FROM node:20-alpine as prod
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY . .
EXPOSE 4000
CMD [ "npm", "run", "start" ]

