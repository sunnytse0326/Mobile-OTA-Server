FROM node:8.14.1-jessie

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4567

CMD ["npm", "start"]

