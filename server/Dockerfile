FROM node:7.3.0

# Create app directory
RUN mkdir -p /usr/src/app/server
WORKDIR /usr/src/app/server
#
RUN apt-get -qq update && \
      apt-get -qq upgrade -y && \
      apt-get install -y --no-install-recommends apt-utils && \
      apt-get install apt-transport-https && \
      apt-get -qq install -y \
      curl \
      nano \
      vim \
      wget \
      git
      # npm install && wget https://yarnpkg.com/install.sh && \

RUN npm install -g yarn 
# wget https://yarnpkg.com/install.sh && \
      # chmod +x install.sh \
      # ./install.sh --nightly
#
RUN npm i -g nodemon strongloop pm2
COPY ./package.json /usr/src/app/server/package.json
COPY . /usr/src/app/server
RUN yarn

# Bundle app source

# RUN npm install nodemon dredd babel-cli migrate phantomjs node-inspector -g

EXPOSE 8078

CMD [ "make", "start" ]
