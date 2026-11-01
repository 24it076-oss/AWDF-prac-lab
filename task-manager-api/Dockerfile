# Week 11: Production Dockerfile for Node/Express Backend
FROM node:18-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .

ENV PORT=5000
EXPOSE 5000

CMD ["npm", "start"]
