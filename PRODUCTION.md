# How to create screenshots in production

In production, you *must* run all commands described in the
[README](README.md) inside Docker containers. The production environment
uses `docker compose` to start the message queue, one metadata worker and
four instances of the screenshot worker (to parallelize the screenshot
processes).


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

### Flushing all commands from the queue

    make shutdown-workers 

This will stop all containers *and* delete their storage volumes, making
the queue empty.

### Refreshing the metadata summary

Run the command 

	make force-summary

to trigger the summary command for the metadata worker. This will refresh
the overview page for Shutterbug, based on the existing metadata files. If
a metadata file is invalid, the metadata worker will show a log message
and ignore the file.

## Background Information: How the docker compose environment works

The production environment uses *two* files to define the setup for `docker compose`:
`docker-compose.yml` and `docker-compose.prod.yml`. The latter overrides
settings in the former. See [Merge Compose Files](https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/)
from the official documentation.

**Do not** use `docker compose` commands without specifying both files! To
make your job easer and to avoid typing long command lines, we have
encapsulated some commands in the [`Makefile`](Makefile) and the shell
script `queue_screenshots.sh`.

`docker-compose.prod.yml` is *not* part of the `banner-screenshots`
repository but part of the infrastructure repository. The deployment
script for `banner-screenshots` will put it into the right place.

> [!IMPORTANT]
> If the number of workers changes in `docker-compose.yml` you must also
> adapt the workers in `docker-compose.prod.yml`!

### Testing the docker compose environment locally

You can test the `docker compose` environment: Both `Makefile` and
`queue_screenshots.sh` will try to fall back to the file
`docker-compose.dev.yml` if the file `docker-compose.prod.yml` does not
exist. You can create the `docker-compose.dev.yml` file by copying the
contents of `docker-compose.dev.example.yml` into it.

