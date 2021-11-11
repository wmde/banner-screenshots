import QueueProducer from "./QueueProducer.js";
import ampqlib from "amqplib";
import { SCREENSHOT_QUEUE } from './queue_names.js';

export default class RabbitMQProducer extends QueueProducer {

	// TODO list channel and connection as properties when we switch to Typescript

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

	async sendTestCase( testCaseMessage ) {
		await this.initialize();
		await this.ch.assertQueue(SCREENSHOT_QUEUE);
		return this.ch.sendToQueue(SCREENSHOT_QUEUE, Buffer.from(
			JSON.stringify(testCaseMessage)
		));
	}

	async disconnect() {
		if (this.ch) {
			await this.ch.close();
		}
		if (this.conn) {
			await this.conn.close();
		}
	}
}
