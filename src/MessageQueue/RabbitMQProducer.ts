import QueueProducer from "./QueueProducer";
import ampqlib, {Channel, Connection} from "amqplib";
import {METADATA_QUEUE, SCREENSHOT_QUEUE} from './queue_names';
import {MetadataInitMessage} from "./Messages";

export default class RabbitMQProducer extends QueueProducer {

	private readonly queueUrl: string;
	private conn: Connection;
	private channel: Channel;

	constructor( queueUrl: string ) {
		super();
		this.queueUrl = queueUrl;
	}

	/**
	 * @private
	 * @returns {Promise<void>}
	 */
	async initialize() {
		if (!this.conn) {
			// TODO get URL from constructor
			this.conn = await ampqlib.connect( this.queueUrl );
		}
		if (!this.channel) {
			this.channel = await this.conn.createChannel();
		}
	}

	async sendTestCase( testCaseMessage ): Promise<void> {
		await this.initialize();
		await this.channel.assertQueue(SCREENSHOT_QUEUE);
		this.channel.sendToQueue(SCREENSHOT_QUEUE, Buffer.from(
			JSON.stringify(testCaseMessage)
		));
	}

	async sendInitializeMetadata(metadataInitMessage: MetadataInitMessage): Promise<void> {
		await this.initialize();
		await this.channel.assertQueue(METADATA_QUEUE);
		this.channel.sendToQueue(METADATA_QUEUE, Buffer.from(
			JSON.stringify(metadataInitMessage)
		));
	}

	async disconnect() {
		if (this.channel) {
			await this.channel.close();
		}
		if (this.conn) {
			await this.conn.close();
		}
	}
}
