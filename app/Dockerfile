FROM node:18

WORKDIR /app
COPY package.json .
RUN npm install
RUN npm install -g http-server
COPY . .
CMD npm run build && npm run docker