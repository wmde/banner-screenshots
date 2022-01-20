import { Command } from 'commander';
import * as path from "path";
import { testFunctionExists } from "../test_functions";

export class ScreenshotsRequest {
	readonly campaignName: string;
	readonly configPath: string;
	readonly testFunction: string;
	readonly queueUrl: string;

	constructor( configPath: string, campaignName: string, testFunctionName: string, queueUrl: string ) {
		this.configPath = configPath;
		this.campaignName = campaignName;
		this.testFunction = testFunctionName;
		this.queueUrl = queueUrl;
	}
}

export class ScreenshotsRequestFactory {
	cwd: string;

	constructor( cwd: string ) {
		this.cwd = cwd
	}

	getRequestParameters() {
		let campaignName = '';
		const program = new Command();
		program
			.option('-c --configName <file>', 'Path to the campaign config file (toml)', 'campaign_info.toml' )
			.option('-t --testFunctionName <name>', 'Name of the test function', 'shootBanner' )
			.option('-u --queueUrl <file>', 'RabbitMQ URL', 'amqp://localhost' )
			.argument( '<CAMPAIGN_NAME>')
			.action( (campaign) => {
				campaignName = campaign
			})
			program.showHelpAfterError();
		program.parse();

		const configPathOpt = program.opts().configName;
		const configPath = path.isAbsolute( configPathOpt) ? configPathOpt : path.join( this.cwd, configPathOpt );

		const testFunctionName = program.opts().testFunctionName;
		if (!testFunctionExists(testFunctionName ) ) {
			console.log( `Unknown test function "${ testFunctionName }"` );
			process.exit( 2 );
		}

		return new ScreenshotsRequest( configPath, campaignName, testFunctionName, program.opts().queueUrl );
	}
}
