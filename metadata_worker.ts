import EnvironmentConfig from "./src/EnvironmentConfig";
import RabbitMQConnection from "./src/MessageQueue/RabbitMQConnection";
import RabbitMQConsumer from "./src/MessageQueue/RabbitMQConsumer";
import RabbitMQProducer from "./src/MessageQueue/RabbitMQProducer";
import { MetadataMessage } from "./src/MessageQueue/Messages";
import CampaignMetadata from "./src/Model/CampaignMetadata";
import {unserializeTestCase} from "./src/Model/TestCaseSerializer";
import {
    isSerializedCampaignMetadata,
    unserializeEntriesToDimensions
} from "./src/Model/MetadataSerializer";
import {FileMetadataRepository, METADATA_FILE} from "./src/FileMetadataRepository";
import path from "path";
import fs from "fs";
import summarizeMetadata from "./src/Model/MetadataSummarizer";
import {WorkerConfigFactory} from "./src/CommandLine/WorkerConfig";

const config = new EnvironmentConfig();
const cliConfig = new WorkerConfigFactory();

const options = cliConfig.getConfig( 'A queue worker that processes metadata messages', process.cwd() );
const screenshotPath = options.outputPath;
const showMessage = options.verbose ? console.log : () => {};
const repo = new FileMetadataRepository( screenshotPath );
const queueConnection = new RabbitMQConnection( config.queueUrl, "Connection established, hit Ctrl-C to quit worker" );
const consumer = new RabbitMQConsumer( queueConnection );
const producer = new RabbitMQProducer( queueConnection );

consumer.consumeMetaDataQueue( async ( msgData: MetadataMessage ) => {
    switch ( msgData.msgType ) {
        case "init":
            const initialMetadata = new CampaignMetadata(
                msgData.testCases.map(unserializeTestCase),
                unserializeEntriesToDimensions(msgData.dimensions),
                msgData.campaignName
            );
            repo.saveMetadata(initialMetadata);
            showMessage(`Initialized metadata file for ${initialMetadata.campaign}`);
            break;
        case "update":
            const testCase = unserializeTestCase(msgData.testCase);
            const metadata = repo.loadMetadata(msgData.campaignName);
            metadata.updateTestCase(testCase);
            repo.saveMetadata(metadata);
            if ( !metadata.hasPendingTestCases() ) {
                await producer.sendMetadataSummary({msgType: 'summary'});
            }
            showMessage(`Updated metadata for testcase ${msgData.testCase.screenshotFilename}`);
            break;
        case "summary":
            const allMetadata = repo.getCampaignNames().reduce((collectedMetaData, campaignName) => {
                const fn = path.join(screenshotPath, campaignName, METADATA_FILE);
                const serializedMetadata = JSON.parse(fs.readFileSync(fn, 'utf-8'));
                if ( isSerializedCampaignMetadata(serializedMetadata) ) {
					collectedMetaData.push(serializedMetadata);
                } else {
                    console.log( `ERROR: File "${fn}" contained invalid metadata` );
				}
                return collectedMetaData;
            }, []);
            const summary = summarizeMetadata(allMetadata);
            const summaryFileName = path.join(screenshotPath, 'metadata_summary.json');
            fs.writeFileSync(summaryFileName, JSON.stringify(summary, null, 4), 'utf-8');
            showMessage(`Updated metadata summary`);
            break;
    }
} );
