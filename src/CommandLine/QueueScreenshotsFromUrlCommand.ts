import { Command } from 'commander';
import * as path from "path";
import { testFunctionExists } from "../test_functions";
import { ScreenshotsRequest } from './ScreenshotsRequest';
import { HttpConfigReader } from '../ConfigReader/HttpConfigReader';
import { determineCampaignFromBranchName } from './determineCampaignFromBranchName'

export class QueueScreenshotsFromUrlCommand {

	getRequestParameters() {
		let branchName = '';
		const program = new Command();
		program
			.option('-t --testFunctionName <name>', 'Name of the test function', 'shootBanner' )
			.option('-u --queueUrl <path>', 'RabbitMQ URL', 'amqp://localhost' )
			.option('-b --baseUrl <url>', 'URL to download campaign config from', 'https://raw.githubusercontent.com/wmde/fundraising-banners/' )
			.argument( '<BRANCH_NAME>', 'Branch or tag name from repository. Will be used to determine channel' )
			.action( bn => {
				branchName = bn;
			} );
			program.showHelpAfterError();
		program.parse();

		const repositoryUrl = program.opts().baseUrl;
		if ( !repositoryUrl ) {
			console.log( "You need to specify a base URL" );
			process.exit( 1 );
		}

		let campaignName = '';
		try {
			campaignName = determineCampaignFromBranchName( branchName );
		} catch ( e ) {
			console.log( e.message );
			process.exit(2);
		}

		const testFunctionName = program.opts().testFunctionName;
		if (!testFunctionExists(testFunctionName ) ) {
			console.log( `Unknown test function "${ testFunctionName }"` );
			process.exit( 2 );
		}

		console.log(`Getting channel "${campaignName}" for branch "${branchName}"`);

		return new ScreenshotsRequest( new HttpConfigReader( repositoryUrl, branchName ), campaignName, testFunctionName, program.opts().queueUrl );
	}
}
