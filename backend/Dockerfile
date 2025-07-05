FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY .env ./
RUN npm install

COPY . .

RUN npm run build
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/server.js"]
