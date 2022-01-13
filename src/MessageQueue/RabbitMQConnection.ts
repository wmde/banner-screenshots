import ampqlib, {Channel, Connection} from "amqplib";

export default class RabbitMQConnection {
    private readonly queueUrl: string;
    private conn: Connection;
    private channel: Channel;

    constructor( queueUrl: string ) {
        this.queueUrl = queueUrl;
    }

    public async initialize(): Promise<void> {
        if (!this.conn) {
            this.conn = await ampqlib.connect( this.queueUrl );
        }
        if (!this.channel) {
            this.channel = await this.conn.createChannel();
        }
    }

    public async assertQueue( queueName ): Promise<void> {
        await this.channel.assertQueue( queueName );
    }

    public getChannel(): Channel {
        return this.channel;
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
