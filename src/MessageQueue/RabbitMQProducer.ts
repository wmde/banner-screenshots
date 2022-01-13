import QueueProducer from "./QueueProducer";
import {METADATA_QUEUE, SCREENSHOT_QUEUE} from './queue_names';
import {MetadataInitMessage, MetadataUpdateMessage} from "./Messages";
import RabbitMQConnection from "./RabbitMQConnection";

export default class RabbitMQProducer extends QueueProducer {

	private readonly connection: RabbitMQConnection;

	constructor( connection: RabbitMQConnection ) {
		super();
		this.connection = connection;
	}

	async sendTestCase( testCaseMessage ): Promise<void> {
		await this.connection.initialize();
		await this.connection.assertQueue( SCREENSHOT_QUEUE );
		this.connection.getChannel().sendToQueue( SCREENSHOT_QUEUE, Buffer.from(
			JSON.stringify(testCaseMessage)
		));
	}

	async sendInitializeMetadata(metadataInitMessage: MetadataInitMessage): Promise<void> {
		await this.connection.initialize();
		await this.connection.assertQueue(METADATA_QUEUE);
		this.connection.getChannel().sendToQueue(METADATA_QUEUE, Buffer.from(
			JSON.stringify(metadataInitMessage)
		));
	}

	async sendMetadataUpdate(metadataUpdateMessage: MetadataUpdateMessage): Promise<void> {
		await this.connection.initialize();
		await this.connection.assertQueue(METADATA_QUEUE);
		this.connection.getChannel().sendToQueue(METADATA_QUEUE, Buffer.from(
			JSON.stringify(metadataUpdateMessage)
		));
	}
}
