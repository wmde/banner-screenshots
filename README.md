# WMDE Banner Screenshots

This is a tool for taking screenshots of WMDE fundraising banners on wikipedia.org in different browsers and resolutions.

The system consists of four parts:

1. A message queue ([RabbitMQ][1])
2. A worker daemon, `screenshot_worker.ts`, that processes screenshot messages from the queue and takes screenshots
3. A worker daemon `metadata_worker.ts`, that creates and updates metadata for every batch of screenshots.
4. A CLI tool that creates a test matrix (a batch of screenshots) from the
   campaign configuration and pushes them into the queue.

Please note that the instructions in this README are for *local 
development* only! To create screenshots, use docker-compose environment
and the instructions in [PRODUCTION.md](PRODUCTION.md).

## Installing the dependencies

	npm install

## Starting the message queue

	make start-rabbitmq

This will start [RabbitMQ][1] inside a docker container (using the
[official RabbitMQ docker image](https://hub.docker.com/_/rabbitmq)),
listening on port 5672.

If you get an error that port 5672 is blocked, make sure that no other
docker containers (e.g. the `docker-compose.yml` file in this repo) are
using the port. Use the command `docker ps` to see which containers use
which port.


## Preparing the configuration file

Create the file `.env` and put in the following content:

	QUEUE_URL="amqp://localhost"
	TB_SECRET="<secret>"
	TB_KEY="<key>"

Replace the placeholders `<secret>` and `<key>` with the real API data from your account at [Testingbot](https://testingbot.com).

## Running the workers

	npm run metadata-worker
	npm run screenshot-worker

### Debugging the screenshot messages

Instead of the full-fledged screenshot worker you can also run

	npm run simple-worker

The "simple_worker" echoes the data it receives and does not take any screenshots.

## Running the screenshot tool

### Creating screenshots for a GitHub branch

The following command will pull the specified campaign branch/tag from the
Banner Repository, figure out which channel (desktop, mobile, ipad, etc) the campaign belongs to and queue screenshot requests for this channel:

	npx ts-node queue_screenshots.ts <CAMPAIGN_NAME>

### Creating screenshots for a local campaign file

	npx ts-node queue_screenshots_from_file.ts -c path/to/campaign_info.toml <CHANNEL_NAME>

#### Downloading the campaign file for a branch

Run the command

	make BRANCH_NAME=<CAMPAIGN_NAME> fetch-campaign-info

Replace the placeholder `<CAMPAIGN_NAME>` with the branch name you want to
fetch from. It defaults to `main`.


#### Using your local copy of the banner repository

The `queue_screenshots_from_file.ts` script will look first in the main
directory of this repository for a `campaign_info.toml`. You can use this
behavior by creating a symbolic link from the `campaign_info.toml` of your
local copy of the [`wmde/fundraising-banners/` repository][2] to the main
directory of the screenshot repository. You can then omit the `-c
path/to/campaign_info.toml` part of the command:

	npx ts-node queue_screenshots_from_file.ts <CHANNEL_NAME>

## Running the unit tests

    npm run test

Use the following command to run individual tests

    npx mocha test/specs/name_of_your_test.js 


## Configuration file format

This is the same file used in the [`wmde/fundraising-banners`
repository][2] for configuring
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
im- and export it in `src/test_functions/index.js` and specify its name 
with the `-t` flag of `queue_screenshots.ts` or
`queue_screenshots_from_file.ts`.

## Flushing the message queue

To throw away all messages currently in the queue, run the following
commands:

	docker stop banner-screenshots-rabbitmq
	make start-rabbitmq

The RabbitMQ Docker container uses container-internal storage for its
messages and when you stop the container, it will delete all its data.

## Architecture

![Architecture - Component Diagram](docs/architecture.svg)

[1]: https://www.rabbitmq.com/
[2]: https://github.com/wmde/fundraising-banners

