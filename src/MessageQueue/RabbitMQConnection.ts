import {ChannelWrapper, connect} from "amqp-connection-manager"
import {IAmqpConnectionManager} from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import {SCREENSHOT_QUEUE, METADATA_QUEUE} from "./queue_names";


export default class RabbitMQConnection {
    private readonly queueUrl: string;
    private readonly connectionEstablishedMessage: string;
    private conn: IAmqpConnectionManager;
    private channel: ChannelWrapper;

    constructor( queueUrl: string, connectionEstablishedMessage: string = '' ) {
        this.queueUrl = queueUrl;
        this.connectionEstablishedMessage = connectionEstablishedMessage;
    }

    public async initialize(): Promise<void> {
        if (!this.conn) {
            this.conn = await connect( this.queueUrl );
        }
        if (!this.channel) {
            this.channel = await this.conn.createChannel( {
                setup: channel => {
                    return Promise.all([
                        channel.assertQueue( SCREENSHOT_QUEUE ),
                        channel.assertQueue( METADATA_QUEUE ),
                        // Since our processing function is async, we have to wait with fetching
                        // until we have acknowledged the message
                        channel.prefetch(1)
                    ]);
                }
            }  );
            if ( this.connectionEstablishedMessage ) {
                this.channel.on( 'connect', () => { console.log( this.connectionEstablishedMessage ) } );
            }
        }
    }

    public getChannel(): ChannelWrapper {
        return this.channel;
    }

    async disconnect() {
        if (this.channel) {
            await this.conn.close();
        }
    }
}
