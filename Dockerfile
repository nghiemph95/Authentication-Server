# Image version
FROM node:16.17.1-alpine AS build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY . .
RUN npm ci --omit=dev --ignore-scripts

# Bundle app source
RUN wget https://gobinaries.com/tj/node-prune && sh node-prune && node-prune

# comand to run the app
CMD [ "npm", "start" ]
