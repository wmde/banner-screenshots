import QueueConsumer from './QueueConsumer';
import ampqlib, {Channel, Connection} from "amqplib";
import { SCREENSHOT_QUEUE } from './queue_names';
import {isTestCaseMessage} from "./Messages";

export default class RabbitMQConsumer extends QueueConsumer {

	conn: Connection;
	channel: Channel;

	async initialize() {
		if (!this.conn) {
			// TODO get URL from constructor
			this.conn = await ampqlib.connect('amqp://localhost');
		}
		if (!this.channel) {
			this.channel = await this.conn.createChannel();
		}
	}

	async consumeScreenshotQueue( onScreenshotMessage ): Promise<void> {
		await this.initialize();
		await this.channel.assertQueue( SCREENSHOT_QUEUE );
		const channel = this.channel;
		// Since our processing function is async, we have to wait with fetching
		// until we have acknowledged the message
		await channel.prefetch(1);
		// TODO check if we have a pre-consume function and execute it, to avoid the impression of the process "hanging"
		await this.channel.consume( SCREENSHOT_QUEUE, async function ( queuedScreenshotMessage ) {
			if ( queuedScreenshotMessage !== null ){
				const msgData = JSON.parse(queuedScreenshotMessage.content.toString());
				if ( isTestCaseMessage( msgData ) ) {
					throw new Error( 'Got invalid message data: ' + queuedScreenshotMessage )
				}

				await onScreenshotMessage( msgData );
				
			}
			channel.ack( queuedScreenshotMessage );
		} );
	}
}
