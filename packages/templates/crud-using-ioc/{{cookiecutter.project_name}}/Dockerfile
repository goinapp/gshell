FROM node:10.15 AS intermediate

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

FROM node:10.15

WORKDIR /app
COPY --from=intermediate /app /app

EXPOSE 3000

CMD ["npm", "start"]
