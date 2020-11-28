FROM node:alpine

WORKDIR /src/usr/app

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]