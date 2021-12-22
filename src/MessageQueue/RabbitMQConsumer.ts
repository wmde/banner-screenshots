import QueueConsumer from './QueueConsumer';
import ampqlib, {Channel, Connection} from "amqplib";
import {METADATA_QUEUE, SCREENSHOT_QUEUE} from './queue_names';
import {isTestCaseMessage, MetadataMessageHandler} from "./Messages";

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
					console.log( 'consumeScreenshotQueue received invalid message data: ', msgData );
					channel.reject( queuedScreenshotMessage, false );
					return;
				}

				try {
					await onScreenshotMessage( msgData );
				} catch ( e ) {
					console.log( 'There was an error creating the screenshot', e, msgData );
					channel.reject( queuedScreenshotMessage, false );
					return;
				}
			}
			channel.ack( queuedScreenshotMessage );
		} );
	}


	async consumeMetaDataQueue(onMetaDataMessage: MetadataMessageHandler): Promise<void> {
		await this.initialize();
		await this.channel.assertQueue( METADATA_QUEUE );
		const channel = this.channel;
		await channel.prefetch(1);
		if ( this.readyMessage ) {
			console.log( this.readyMessage );
		}
		await this.channel.consume( METADATA_QUEUE, async function ( queuedMetadataMessage ) {
			if ( queuedMetadataMessage !== null ){
				const msgData = JSON.parse( queuedMetadataMessage.content.toString() );

				// TODO check type of msgData similar to what we do in consumeScreenshotQueue

				try {
					await onMetaDataMessage( msgData );
				} catch ( e ) {
					console.log( 'There was an error handling the metadata', e, msgData );
					channel.reject( queuedMetadataMessage, false );
					return;
				}
			}
			channel.ack( queuedMetadataMessage );
		} );
	}
}
