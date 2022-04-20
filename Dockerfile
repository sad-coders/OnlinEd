FROM node:16

WORKDIR /usr/app

COPY package*.json ./
# RUN apk add --update python make g++  && rm -rf /var/cache/apk/*
RUN npm install
COPY . .

EXPOSE 8080
EXPOSE 80
EXPOSE 5000
CMD ["npm", "start"]