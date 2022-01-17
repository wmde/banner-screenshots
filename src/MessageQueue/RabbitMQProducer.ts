import QueueProducer from "./QueueProducer";
import {METADATA_QUEUE, SCREENSHOT_QUEUE} from './queue_names';
import {MetadataInitMessage, MetadataMessage, MetadataSummaryMessage, MetadataUpdateMessage} from "./Messages";
import RabbitMQConnection from "./RabbitMQConnection";

export default class RabbitMQProducer extends QueueProducer {

	private readonly connection: RabbitMQConnection;

	constructor( connection: RabbitMQConnection ) {
		super();
		this.connection = connection;
	}

	async sendTestCase( testCaseMessage ): Promise<void> {
		await this.connection.initialize();
		await this.connection.getChannel().sendToQueue( SCREENSHOT_QUEUE, Buffer.from(
			JSON.stringify(testCaseMessage)
		));
	}

	async sendInitializeMetadata(metadataInitMessage: MetadataInitMessage): Promise<void> {
		await this.sendMessageToChannel( metadataInitMessage );
	}

	async sendMetadataUpdate(metadataUpdateMessage: MetadataUpdateMessage): Promise<void> {
		await this.sendMessageToChannel( metadataUpdateMessage );
	}

	async sendMetadataSummary(metadataMessage: MetadataSummaryMessage): Promise<void> {
		await this.sendMessageToChannel( metadataMessage );
	}

	private async sendMessageToChannel( msg: MetadataMessage ): Promise<void> {
		await this.connection.initialize();
		await this.connection.getChannel().sendToQueue(METADATA_QUEUE, Buffer.from( JSON.stringify( msg ) ) );
	}
}
