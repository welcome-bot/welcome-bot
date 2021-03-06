FROM node:14
RUN mkdir -p /src/user/app
WORKDIR /src/user/app
COPY . .
RUN npm install -g npm
RUN npm install
RUN npm update
RUN apt-get update && apt-get install -y ffmpeg
EXPOSE 8080
CMD ["node", "webserver.js" ]
