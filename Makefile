BRANCH_NAME := 'main'

start-workers:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

stop-workers:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

generate-dev-config:
	if [ ! -f docker-compose.dev.yml ]; then cp docker-compose.dev.example.yml docker-compose.dev.yml; fi

fetch-campaign-info:
	curl -o campaign_info.toml -L https://raw.githubusercontent.com/wmde/fundraising-banners/${BRANCH_NAME}/campaign_info.toml

start-rabbitmq:
	docker run -d --name amqp.test -p 5672:5672 rabbitmq
