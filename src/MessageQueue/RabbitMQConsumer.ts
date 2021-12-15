import QueueConsumer from './QueueConsumer';
import ampqlib, {Channel, Connection} from "amqplib";
import { SCREENSHOT_QUEUE } from './queue_names';
import {isTestCaseMessage} from "./Messages";

export default class RabbitMQConsumer extends QueueConsumer {

	private readonly queueUrl: string;
	private readonly readyMessage: string;
	private conn: Connection;
	private channel: Channel;

	constructor( queueUrl: string, readyMessage = '' ) {
		super();
		this.queueUrl = queueUrl;
		this.readyMessage = readyMessage;
	}

	async initialize() {
		if (!this.conn) {
			this.conn = await ampqlib.connect( this.queueUrl );
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
		if ( this.readyMessage ) {
			console.log( this.readyMessage );
		}
		await this.channel.consume( SCREENSHOT_QUEUE, async function ( queuedScreenshotMessage ) {
			if ( queuedScreenshotMessage !== null ){
				const msgData = JSON.parse(queuedScreenshotMessage.content.toString());
				if ( !isTestCaseMessage( msgData ) ) {
					throw new Error( 'Got invalid message data: ' + queuedScreenshotMessage )
				}

				await onScreenshotMessage( msgData );

			}
			channel.ack( queuedScreenshotMessage );
		} );
	}
}
