BRANCH_NAME := 'main'

ifeq ($(wildcard docker-compose.prod.yml),)
DOCKER_COMPOSE_OVERRIDE:=docker-compose.dev.yml
else
DOCKER_COMPOSE_OVERRIDE:=docker-compose.prod.yml
endif

force-summary:
	docker-compose -f docker-compose.yml -f ${DOCKER_COMPOSE_OVERRIDE} exec metadata_worker npx ts-node metadata_summary.ts -u amqp://rabbitmq

# Start/Stop container environment. This will run the scripts inside the built container, NOT the scripts in the local environment
start-workers:
	docker-compose -f docker-compose.yml -f ${DOCKER_COMPOSE_OVERRIDE} up -d

stop-workers:
	docker-compose -f docker-compose.yml -f ${DOCKER_COMPOSE_OVERRIDE} down

# ====================== Dev Environment tasks

generate-dev-config:
	if [ ! -f docker-compose.dev.yml ]; then cp docker-compose.dev.example.yml docker-compose.dev.yml; fi

# Start a rabbitmq instance that workers outside the environemnt can connect to
start-rabbitmq:
	docker run -d --name amqp.test -p 5672:5672 rabbitmq

fetch-campaign-info:
	curl -o campaign_info.toml -L https://raw.githubusercontent.com/wmde/fundraising-banners/${BRANCH_NAME}/campaign_info.toml


