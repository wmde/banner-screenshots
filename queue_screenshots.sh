#!/bin/bash

# reverse sort prefers prod over dev
DOCKERFILE_OVERRIDE=$(find . -name "docker-compose.*.yml" | sort -r | head -n 1)

if [ -z "$DOCKERFILE_OVERRIDE" ]; then
	echo "No override dockerfile found. Please create docker-compose.prod.yml"
	exit 1;
fi

set -x

docker-compose -f docker-compose.yml -f $DOCKERFILE_OVERRIDE exec screenshot_worker_1 npx ts-node queue_screenshots.ts -u amqp://rabbitmq $@
