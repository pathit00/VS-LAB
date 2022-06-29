FROM node:16.15.1
WORKDIR /VS-LAB
COPY package.json
RUN npm install
COPY . .
CMD npm start

