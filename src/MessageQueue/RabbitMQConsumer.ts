import QueueConsumer from './QueueConsumer';
import {METADATA_QUEUE, SCREENSHOT_QUEUE} from './queue_names';
import {isTestCaseMessage, MetadataMessageHandler} from "./Messages";
import RabbitMQConnection from "./RabbitMQConnection";

export default class RabbitMQConsumer extends QueueConsumer {

	private readonly connection: RabbitMQConnection;
	private readyMessage: string;

	constructor( connection: RabbitMQConnection, readyMessage: string = '' ) {
		super();
		this.connection = connection;
		this.readyMessage = readyMessage;
	}

	async consumeScreenshotQueue( onScreenshotMessage ): Promise<void> {
		await this.connection.initialize();
		await this.connection.assertQueue( SCREENSHOT_QUEUE );
		const channel = this.connection.getChannel();
		// Since our processing function is async, we have to wait with fetching
		// until we have acknowledged the message
		await channel.prefetch(1);
		if ( this.readyMessage ) {
			console.log( this.readyMessage );
		}
		await channel.consume( SCREENSHOT_QUEUE, async function ( queuedScreenshotMessage ) {
			if ( queuedScreenshotMessage === null ) {
				channel.ack(queuedScreenshotMessage);
				return;
			}

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
			channel.ack( queuedScreenshotMessage );
		} );
	}


	async consumeMetaDataQueue(onMetaDataMessage: MetadataMessageHandler): Promise<void> {
		await this.connection.initialize();
		await this.connection.assertQueue( SCREENSHOT_QUEUE );
		const channel = this.connection.getChannel();
		await channel.prefetch(1);
		if ( this.readyMessage ) {
			console.log( this.readyMessage );
		}
		await channel.consume( METADATA_QUEUE, async function ( queuedMetadataMessage ) {
			if ( queuedMetadataMessage === null ) {
				channel.ack(queuedMetadataMessage);
				return;
			}

			const msgData = JSON.parse( queuedMetadataMessage.content.toString() );

			// TODO check type of msgData similar to what we do in consumeScreenshotQueue

			try {
				await onMetaDataMessage( msgData );
			} catch ( e ) {
				console.log( 'There was an error handling the metadata', e, msgData );
				channel.reject( queuedMetadataMessage, false );
				return;
			}
			channel.ack( queuedMetadataMessage );
		} );
	}
}
