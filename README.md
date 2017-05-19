# kids_rooms

# Setup

 - For Mac and Window users: [Docker Toolbox](https://www.docker.com/products/docker-toolbox)
 - Create docker machine:   ```docker-machine create --driver virtualbox default``` 
 - For Linux users: [Docker](https://docs.docker.com/engine/installation/) and [Docker Compose](https://docs.docker.com/compose/install/)  
 
# Up Project

  - Go to docker dir: ```cd docker```
  - Build and run project as daemon: ```./run.sh```
  - If you want see output of container run dev mode: ```./dev.sh```   
  - [More information about docker scripts!](docker/README.md) 
  
# Hosts

  - [Manual how change hosts in your OS](http://www.howtogeek.com/howto/27350/beginner-geek-how-to-edit-your-hosts-file/)
  - For Mac and Window users need know docker-machine IP: ``` docker-machine ip default ```
  Example of output: ```192.168.99.101```
  - Add next lines in your hosts (change IP if you have different): 
  192.168.99.100  kids_rooms.com
  
# Urls

  - [Project in browser](kids_rooms.com:8078) - kids_rooms.com:8078
	- http://192.168.99.100:8078/explorer  kids_rooms.com:8078/explorer
  - PostgreSQL DB: ```{docker machine IP}:5432``` for example ```192.168.99.100:5432```


### Without docker
If you want to run project without docker, you must have access tp PostgreSQL.
Add your own variables to loopback config files : eg datasources.production.json, datasources.development.js, middleware.development.json etc...

### MacOS issue
Developing on mac with docker can take a long time for build containers and for webpack-hot-reload.
To solve this problem, start './run.sh only_db' that will create only a postgres container. 
Then it needs to put a db url(host, port) in 'datasources.development.js' or datasources.{$NODE_ENV}.js.
You can start application with 'npm run dev' or 'yarn run dev' for development from 'server' folder, that is inside root directory

### Simple lint 
You can lint this project simply by installing:
`npm i standard snazzy -g`
and running `standard --verbose | snazzy`


### simple run project:
go to docker folder, `sudo bash run.sh` server will be available on `0.0.0.0:8078`
