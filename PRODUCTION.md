# How to create screenshots in production

The production environment uses `docker compose` to start the message
queue, one metadata worker and four instances of the screenshot worker (to
parallelize the screenshot processes).

In production, you *must* run all commands described in the
[README](README.md) inside Docker containers. To avoid long command lines,
we have encapsulated the commands in a [`Makefile`](Makefile) and the
shell script `queue_screenshots.sh`.

## Creating Screenshots

Run the command

```shell
./queue_screenshot.sh <BRANCH_NAME>
```

With `<BRANCH_NAME>` being a tag or branch name on the [Banner GitHub
repository](https://github.com/wmde/fundraising-banners), e.g.
`C22_WMDE_Test_04` or `C22_WMDE_Mobile_EN_Test_01`. The script will try to
figure out the channel (desktop, mobile, pad_en, etc.) from the branch
name.

The shell script is a wrapper for a long `docker compose exec` command.

The background workers will create a campaign directory inside the
`banner-shots` directory. Depending on the docker-compose file used (prod,
dev) the configuration will mount different host paths into the containers
as the `banner-shots` directory. The campaign directory contains the
screenshot images and file `metadata.json` with all the metadata about the
test case.

## Starting and stopping the message queue and workers

The following command will start the workers, [RabbitMQ](https://www.rabbitmq.com/), and put them in the same virtual network:

	make start-workers

**Do not use the command `docker compose up -d`!**

The production environment uses the ["override"
mechanism](https://docs.docker.com/compose/extends/#multiple-compose-files)
of docker-compose (to bind-mount different versions of the configuration
file and output directory in development and production) and the Makefile
detects the correct environment (dev/prod) and uses the correct overrides.


You can stop the environment with

	make stop-workers


## Commands for Troubleshooting


### Check if the containers are running

	docker compose ps

The container state of all containers should be "Up".

### Check if the banner-shots directory is mounted into the container

	docker compose exec screenshot_worker_1 ash -c 'ls -al'

The directory listing should show the `banner-shots` directory with an
owner of `node`.

### Check if the workers are doing something

You can get a unified stream of log output (with timestamps) by running

	docker compose logs -tf

By default, the workers should start with the `--verbose` flag
(see `entrypoint` in the `docker-compose` file).


### Show queue and message count

	docker compose exec rabbitmq bash -c 'rabbitmqctl list_queues'

### Refreshing the metadata summary

Run the command 

	make force-summary

to trigger the summary command for the metadata worker. This will refresh
the overview page for Shutterbug, based on the existing metadata files. If
a metadata file is invalid, the metadata worker will show a log message
and ignore the file.


