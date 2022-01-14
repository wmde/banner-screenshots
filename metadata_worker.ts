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
import {Command} from "commander";
import path from "path";
import fs from "fs";
import summarizeMetadata from "./src/MetadataSummarizer";

const config = EnvironmentConfig.create();

const program = new Command();
program.option('-s --screenshotPath <path>', 'Path to directory containing campaign directories with metadata', 'banner-shots');
// TODO add verbosity flag for logging
program.showHelpAfterError();
program.parse();

const screenshotPath = program.opts().screenshotPath;
const repo = new FileMetadataRepository( screenshotPath );
const queueConnection = new RabbitMQConnection( config.queueUrl );
const consumer = new RabbitMQConsumer( queueConnection, "Connection established, hit Ctrl-C to quit worker" );
const producer = new RabbitMQProducer( queueConnection );

consumer.consumeMetaDataQueue( async ( msgData: MetadataMessage ) => {
    if ( msgData.msgType === 'init' ) {
        const metadata = new CampaignMetadata(
            msgData.testCases.map( unserializeTestCase ),
            unserializeEntriesToDimensions( msgData.dimensions ),
            msgData.campaignName
        );
        repo.saveMetadata( metadata );
        // TODO check verbosity flag
        console.log( `Initialized metadata file for ${metadata.campaign}` );
    }
    if ( msgData.msgType === 'update' ) {
        const testCase = unserializeTestCase( msgData.testCase );
        const metadata = repo.loadMetadata( msgData.campaignName );
        metadata.updateTestCase( testCase );
        repo.saveMetadata( metadata );
        if ( !metadata.hasPendingTestCases() ) {
            await producer.sendMetadataSummary( {
                msgType: 'summary',
                campaignName: msgData.campaignName
            } );
        }
        // TODO check verbosity flag
        console.log(`Updated metadata for testcase ${msgData.testCase.screenshotFilename}`);
    }
    if ( msgData.msgType === 'summary' ) {
        const allMetadata = repo.getCampaignNames().map( campaignName => {
            const fn = path.join( screenshotPath, campaignName, METADATA_FILE );
            const serializedMetadata = JSON.parse( fs.readFileSync( fn, 'utf-8' ) );
            if ( !isSerializedCampaignMetadata( serializedMetadata ) ) {
                throw new Error( `ERROR: File "${fn}" contained invalid metadata` );
            }
            return serializedMetadata;
        } );
        const summary = summarizeMetadata( allMetadata );
        const summaryFileName = path.join( screenshotPath, 'metadata_summary.json' );
        fs.writeFileSync( summaryFileName, JSON.stringify( summary, null, 4 ), 'utf-8' );
        // TODO check verbosity flag
        console.log(`Updated metadata summary`);
    }
} );
