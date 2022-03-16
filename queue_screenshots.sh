#!/bin/bash

# This shell script allows to run the queue_screenshots CLI inside the docker
# container of the first screenshot worker, That is necessary/convenient,
# because otherwise we'd have to build a standalone docker image for that and
# would have to pass the network created by docker-compose to that docker image
# when running it, to be able to access RabbitMQ inside the docker environment.

# When we run the screenshot tool as part of CI (see https://phabricator.wikimedia.org/T302624 )
# we'll have a dedicated docker image and some way to get to the RabbitMQ network.


# reverse sort prefers prod over dev
DOCKERFILE_OVERRIDE=$(find . -name "docker-compose.*.yml" | sort -r | head -n 1)

if [ -z "$DOCKERFILE_OVERRIDE" ]; then
	echo "No override dockerfile found. Please create docker-compose.prod.yml"
	exit 1;
fi

set -x

docker-compose -f docker-compose.yml -f $DOCKERFILE_OVERRIDE exec screenshot_worker_1 npx ts-node queue_screenshots.ts -u amqp://rabbitmq $@
