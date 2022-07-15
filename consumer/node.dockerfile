FROM node:18.4-alpine3.15
RUN mkdir app
WORKDIR /app
COPY package*.json ./ 
RUN npm install 
COPY . . 
CMD [ "node", "app.js" ]