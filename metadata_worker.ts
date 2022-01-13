import EnvironmentConfig from "./src/EnvironmentConfig";
import RabbitMQConsumer from "./src/MessageQueue/RabbitMQConsumer";
import { MetadataMessage } from "./src/MessageQueue/Messages";
import CampaignMetadata from "./src/Model/CampaignMetadata";
import {unserializeTestCase} from "./src/Model/TestCaseSerializer";
import {unserializeEntriesToDimensions} from "./src/Model/MetadataSerializer";
import {FileMetadataRepository} from "./src/FileMetadataRepository";
import {Command} from "commander";

const config = EnvironmentConfig.create();

const program = new Command();
program.option('-s --screenshotPath <path>', 'Path to directory containing campaign directories with metadata', 'banner-shots');
// TODO add verbosity flag for logging
program.showHelpAfterError();
program.parse();

const repo = new FileMetadataRepository( program.opts().screenshotPath );
const consumer = new RabbitMQConsumer( config.queueUrl, "Connection established, hit Ctrl-C to quit worker" );

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
        // TODO send MetadataSummaryMessage when all test cases have finished<
        // TODO check verbosity flag
        console.log(`Updated metadata for testcase ${msgData.testCase.screenshotFilename}`);
    }
} );
