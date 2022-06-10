FROM node:14.17.5
RUN mkdir /usr/local/nodejs
RUN ls /usr/local
RUN wget https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-x64.tar.xz \
 && xz -d node-v16.13.0-linux-x64.tar.xz \
 && tar -xf node-v16.13.0-linux-x64.tar \
 && rm -f node-v16.13.0-linux-x64.tar \
 && mv node-v16.13.0-linux-x64/* /usr/local/nodejs \
 && rm -rf node-v16.13.0-linux-x64 \
 && npm config set registry=https://registry.npm.taobao.org \
 && npm install -g cnpm
RUN npm install -g @vue/cli
COPY ./ /
RUN cd / \
 && cnpm install
ENTRYPOINT ["npm","run","serve"]
