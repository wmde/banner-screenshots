# Local development without docker-compose

When making changes to the screenshot tool you can avoid the build cycle
of the Docker images by running the environment in your local environment.

## Installing the dependencies

	npm install

## Run a rabbitmq instance

	make start-rabbitmq

Make sure that the docker-compose environment is not running, otherwise
you will get port conflicts on port 5672

## Running the workers

You have to set the environment variables `QUEUE_URL` (e.g. `amqp://localhost`), `TB_SECRET` and `TB_KEY` (authentication data for testingbot) before running the scripts.

	npm run metadata-worker
	npm run screenshot-worker

Instead of the full-fledged screenshot worker you can also run
`npm run simple-worker` which echoes the data it receives.


## Running the screenshot tool

	npx ts-node queue_screenshots.ts -c path/to/campaign_info.toml <CAMPAIGN_NAME>

Instead of using the `-c` parameter, you can also create a symbolic link
from your local copy of `wmde/fundraising-banners` to the screenshot tool
directory.

## Running the unit tests

    npm run test

Use the following command to run individual tests

    npx mocha test/specs/name_of_your_test.js 

## Downloading the campaign file for a branch

Run the command

	make BRANCH_NAME=<branchname> fetch-campaign-info

Replacing the placeholder `<branchname>` with the branch name you want to
fetch from. It defaults to `main`.

