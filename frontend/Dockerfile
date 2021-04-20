FROM node:15.12.0

# Create app directory
WORKDIR /usr/src/app
ENV REACT_APP_API_URL="http://leves.info:9899/"
ENV REACT_APP_TITLE="Compare Sounds"

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn install --network-timeout 1000000
RUN yarn global add serve
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
RUN yarn build
EXPOSE 5000
CMD [ "serve", "-s", "build", "--ssl-cert", "fullchain.pem", "--ssl-key", "privkey.pem" ]
