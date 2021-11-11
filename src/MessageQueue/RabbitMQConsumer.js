import QueueConsumer from './QueueConsumer.js';
import ampqlib from "amqplib";
import { SCREENSHOT_QUEUE } from './queue_names.js';

export default class RabbitMQConsumer extends QueueConsumer {

	/**
	 * @private
	 * @returns {Promise<void>}
	 */
	async initialize() {
		if (!this.conn) {
			// TODO get URL from constructor
			this.conn = await ampqlib.connect('amqp://localhost');
		}
		if (!this.ch) {
			this.ch = await this.conn.createChannel(this.conn);
		}
	}

	async consumeScreenshotQueue( onScreenshotMessage ) {
		await this.initialize();
		await this.ch.assertQueue( SCREENSHOT_QUEUE );
		const channel = this.ch;
		// Since our processing function is async, we have to wait with fetching
		// until we have acknowledged the message
		await channel.prefetch(1);
		// TODO check if we have a pre-consume function and execute it, to avoid the impression of the process "hanging"
		this.ch.consume( SCREENSHOT_QUEUE, async function ( queuedScreenshotMessage ) {
			if ( queuedScreenshotMessage !== null ){
				const msgData = JSON.parse(queuedScreenshotMessage.content.toString());
				await onScreenshotMessage( msgData );
			}
			channel.ack( queuedScreenshotMessage );
		} );
	}
}
