#!/usr/bin/env ts-node-script

import RabbitMQConnection from "./src/MessageQueue/RabbitMQConnection";
import RabbitMQProducer from "./src/MessageQueue/RabbitMQProducer";
import EnvironmentConfig from "./src/EnvironmentConfig";

const config = EnvironmentConfig.create();
const queueConnection = new RabbitMQConnection( config.queueUrl );
const producer = new RabbitMQProducer( queueConnection );

( async () => {
	await producer.sendMetadataSummary( { msgType: 'summary' } );
	await queueConnection.disconnect();
	console.log( 'Queued metadata summary update' );
} )();
