# WMDE Banner Screenshots

This is a tool for taking screenshots of WMDE fundraising banners on wikipedia.org in different browsers and resolutions.

To improve performance, the system consists of parallelizable worker scripts for taking screenshots and processing metadata, connected by a message queue.

## Configuration
The screenshot background worker needs credentials for the Testingbot service. Put these in the file named `.env`.
You can copy and adapt the file `env-template`.

Have a look at the `docker-compose.yml` file to see the paths
mounted into the containers:

- The one mounted to `banner-shots` will contain the screenshots and metadata.
- The one mounted to `campaign_info.toml` must exist and contain a banner
	configuration file (see below).

Do not change the paths in `docker-compose.yml` file directly! If you
can't provide the required paths in your local setup, create an [override
docker-compose
file](https://docs.docker.com/compose/extends/#multiple-compose-files) and
use the `-f` parameter to specify additional file for all `docker-compose`
commands. Example:

	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

## Starting the Environment

The screenshot tool needs background workers and a message queue (see architecture diagram below). To start these, run

    docker-compose up -d

This will start the background workers and [RabbitMQ](https://www.rabbitmq.com/) and expose it on Port 5672 on the 
local machine.

## Creating Screenshots

Run the screenshot tool with the following command

    docker-compose exec screenshot_worker_1 npx ts-node queue_screenshots.ts <CAMPAIGN_NAME>

The `queue_screenshot` tool will look for the file `campaign_info.toml`,
create a test matrix and queue the tests. 

`<CAMPAIGN_NAME>` must be one of the configuration keys of that
configuration file, e.g. `desktop` or `mobile`.

The background workers will create a directory inside the `banner-shots` directory. The campaign directory contains the 
screenshot images and file `metadata.json` with all the metadata about the test case.


### Configuration file format

This is the same file used in the [`wmde/fundraising-banners`
repository](https://github.com/wmde/fundraising-banners) for configuring
campaigns. It also contains test matrix configurations.

The TOML file has the following (abbreviated) format

```toml
[campaign]
campaign_tracking = 211215-ba-11
preview_url = "https://example.com/banner/{{PLACEHOLDER}}"
...


[campaign.banners.ctrl]
pagename = "B21_WMDE_Test_11_ctrl"
...


[campaign.test_matrix]

platform = ["edge", "firefox_win10" ]
resolution = ["1280x960", "1024x768"]

```

`[campaign]` is the key you pass to the screenshot tool. The TOML file can
contain several campaigns, each one for a specific *channel* (a
combination of device type and language). `[campaign]` in the example
above is a placeholder, the campaign name can consist of all
alphanumeric characters, e.g. `desktop` or `ipad_en`.

Each campaign will also have at least one banner, configured in the 
`[campaign.banners.BANNER_NAME]` section. Usually, `BANNER_NAME` is `ctrl` or `var`.
Each banner has a unique `pagename` which designates its page name in
CentralNotice. To preview a banner (and to render the screenshot), you
replace the `{{PLACEHOLDER}}` with the banner name in the `preview_url` of
the campaign. The screenshot tool will run the test matrix for each
banner.

The `[campaign.test_matrix]` key can contain one of two test dimensions:
`device` and `orientation` (for mobile devices) or `platform` and
`resolution` (for desktop browsers).

To see the available values for `platform` and `device`, look at the
`CapabilityFactory` class that defines what these values mean in the
context of the testing service (testingbot.com or saucelabs.com).

All values are arrays with at least one element. The screenshot tool will
use each matrix key with each other matrix key and the banners.  
Example:
`platform=["edge", "safari", "chrome_linux"]`, `resolutions=["1280x960",
"1024x768"]` and 2 banners, `ctrl` and `var`, will create 12 (3*2*4)
screenshots.


## Different test functions for different banners

Add a different test function to the `src/test_functions/` directory,
im- and export it in `src/test_functions/index.js` and specify its name in
`testFunctionName` in `index.js`.

## Local development

To avoid the build cycle of the Docker images, you can also develop
locally.

### Installing the dependencies

	npm install

### Run a rabbitmq instance

	docker run -d --name amqp.test -p 5672:5672 rabbitmq


### Running the workers

You have to set the environment variables `QUEUE_URL` (e.g. `amqp://localhost`), `TB_SECRET` and `TB_KEY` (authentication data for testingbot) before running the scripts.

	npx ts-node metadata_worker.ts
	npx ts-node screenshot_worker.ts

Instead of the full-fledged screenshot worker you can also run
`simple_worker.js` which just echoes the data it receives.


### Running the screenshot tool

	npx ts-node queue_screenshots.ts -c path/to/campaign_info.toml <CAMPAIGN_NAME>

Instead of using the `-c` parameter, you can also create a symbolic link
from your local copy of `wmde/fundraising-banners` to the screenshot tool
directory.

### Running the unit tests

    npm run test

Use the following command to run individual tests

    npx mocha test/specs/name_of_your_test.js 

## Architecture

![Architecture - Component Diagram](docs/architecture.svg)
