import QueueProducer from "./QueueProducer";
import ampqlib, {Channel, Connection} from "amqplib";
import { SCREENSHOT_QUEUE } from './queue_names';

export default class RabbitMQProducer extends QueueProducer {

	conn: Connection;
	channel: Channel;

	/**
	 * @private
	 * @returns {Promise<void>}
	 */
	async initialize() {
		if (!this.conn) {
			// TODO get URL from constructor
			this.conn = await ampqlib.connect('amqp://localhost');
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

	async disconnect() {
		if (this.channel) {
			await this.channel.close();
		}
		if (this.conn) {
			await this.conn.close();
		}
	}
}
