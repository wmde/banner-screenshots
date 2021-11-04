# 001 - Use a message queue

Date: 2021-11-04

Deciders: Abban Dunne, Corinna Hillebrand, Gabriel Birke

Technical Story: https://phabricator.wikimedia.org/T295061

## Status

accepted

## Context

We are experiencing concurrency errors and broken error handling when
running screenshots in batches using our custom batching code. To
fix this, we wanted to "outsource" the batching and running tasks to
a dedicated software system.

The work load and amount of data of the screenshot tool is small enough
that we don't need a complex message queue system or distributed
processing. The only requirement we have is to run up to 5 screenshot
processes in parallel and isolated from each other.

### Considered solutions

#### Improve existing batch code

The recommended way of doing multiple tests at once with Testingbot is to
misuse a feature that's meant for testing the interaction of multiple
browsers, not testing in isolation. It also means that we'd have to find a
different batching solution for each new screenshot provider (as we had to
do when switching from Saucelabs to Testingbot)

#### Write our own batching code
We could write our own code, e.g. based on
[concurrently](https://www.npmjs.com/package/concurrently) and lock files.
But batching is not the core domain of the screenshot tool and we'd have
to maintain our own solution.

#### Gearman
http://gearman.org/ - The project looks dated and the documentation is not
extensive.

#### Redis with RSMQ
[RSMQ](https://github.com/smrchy/rsmq) is a JavaScript library that
implements a message queue on top of Redis. If we already used Redis this
would be a good choice to avoid adding another external service. But in
the current project, it feels like "misusing" a database as a message
queue.

#### Cloud-based queue
Cloud-based queues like Amazon SQS, Google Cloud Tasks or Azure Queue
Storage would bind us to a specific cloud provider and might cost us money
eventually. Also, those message queues are for much bigger workloads than
we have

#### ZeroMQ
[ZeroMQ](https://zeromq.org/) is a likely candidate because it's
open source, lightweight and does one thing - distributing messages.

#### RabbitMQ
[RabbitMQ](https://www.rabbitmq.com/) is another open source message queue.

## Decision

We will change our code to use a message queue to distribute screenshot
tasks to workers. Another worker in a different queue will be responsible
for generating and updating the metadata information.

We choose RabbitMQ over ZeroMQ because RabbitMQ has more features for
future requirements (web and CLI tools for queue management, performance
measuring).

## Consequences

### Benefits
- Better error recovery (if one image task fails, it doesn't affect the others).
- Simpler architecture (remove all provider-specific batching code),
	workers can run standalone
- When we put the queue and workers on the server, we can all submit
    screenshot jobs without running into Testingbot limits. Also, we don't
    have to upload the image files and can automatically regenerate the
    metadata.
- If we switch screenshot providers, we're more independent from their batching mechanism
- We can integrate into our Drone CI system more easily
- We could gather performance data (how long a task takes) in the future
- RabbitMQ comes with a command line tool to inspect and modify (i.e. drop) the queue. Later, we could even use a web UI.

### Drawbacks
- Effort for changing the code: splitting into 3 different CLI tools (one
	worker for screenshots, one worker for maintaining the metadata state
	and a "test case pusher" that puts the tests cases in the queue).
- Added complexity - needing to learn a new library for interfacing with
	RabbitMQ
- Maintenance - We need to maintain the docker image / container for
	RabbitMQ.
- Slightly slower individual test runs
