#!/usr/bin/env ts-node-script

import { Command } from 'commander';

import RabbitMQConnection from "./src/MessageQueue/RabbitMQConnection";
import RabbitMQProducer from "./src/MessageQueue/RabbitMQProducer";
		
const program = new Command();
program
	.option('-u --queueUrl <file>', 'RabbitMQ URL', 'amqp://localhost' )
	program.showHelpAfterError();
program.parse();

const queueUrl = program.opts().queueUrl;

const queueConnection = new RabbitMQConnection( queueUrl );
const producer = new RabbitMQProducer( queueConnection );

( async () => {
	await producer.sendMetadataSummary( { msgType: 'summary' } );
	await queueConnection.disconnect();
	console.log( 'Queued metadata summary update' );
} )();
