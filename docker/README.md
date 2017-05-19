# Usage
 - Run docker for building images and running containers for your CONTEXT: ``` ./run.sh CONTEXT``` 
 - Get container output: ``` ./output.sh CONTEXT CONTAINER ```
 - Get shell access to container:  ``` ./shell.sh CONTEXT CONTAINER ```
 - Restart container:  ``` ./restart.sh CONTEXT CONTAINER ```
 - Remove containers: ```./remove.sh CONTEXT ```
 
Where:
 - CONTEXT is name of dir in docker/contexts. You can use different docker-compose, just type CONTEXT if you need.
 - CONTAINER is name of container in compose file ( examples: server, PostgreSQL )

#Default CONTEXT

By default used 'common' CONTEXT. So you don't need type ```./run.sh local``` just type ```./run.sh```

#Fix connection with Docker-Machine
If you open new terminal and have problem with docker like: 

ERROR: Couldn't connect to Docker daemon - you might need to run `docker-machine start default`.

Just type in terminal next command: ```eval "$(docker-machine env default)"```




 

