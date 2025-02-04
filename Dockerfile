FROM node:18

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 8080

CMD ["npx", "live-server", "--port=8080", "--host=0.0.0.0"]
