FROM node:14

WORKDIR /app
COPY . .

COPY package*.json ./
RUN npm install --quiet
EXPOSE 8081
CMD ["sh", "-c", "npm install && npm run dev"]

