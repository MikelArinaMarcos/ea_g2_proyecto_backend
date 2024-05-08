FROM node:21

WORKDIR /app

COPY package*.json ./

RUN npm install -g typescript ts-node

RUN npm install 

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]