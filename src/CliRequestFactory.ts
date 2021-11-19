import { Command } from 'commander';
import * as path from "path";
import testFunctions from "./test_functions/index";
import {ScreenshotsRequest} from "./ScreenshotGenerator";

export class CliRequestFactory {
	cwd: string;

	constructor( cwd: string ) {
		this.cwd = cwd
	}

	getRequestParameters() {
		let campaignName = '';
		const program = new Command();
		program
			.option('-s --screenshotPath <path>', 'Path to directory containing campaign directories with metadata', 'banner-shots')
			.option('-c --configName <file>', 'Path to the campaign config file (toml)', 'campaign_info.toml' )
			.option('-l --concurrentRequestLimit <limit>', 'Amount of concurrent requests to screenshot provider', '4' )
			.option('-t --testFunctionName <name>', 'Name of the test function', 'shootBanner' )
			.argument( '<CAMPAIGN_NAME>')
			.action( (campaign) => {
				campaignName = campaign
			})
			program.showHelpAfterError();
		program.parse();

		const screenshotPathOpt = program.opts().screenshotPath;
		const screenshotPath = path.isAbsolute( screenshotPathOpt) ? screenshotPathOpt : path.join( this.cwd, screenshotPathOpt );
		const configPathOpt = program.opts().configName;
		const configPath = path.isAbsolute( configPathOpt) ? configPathOpt : path.join( this.cwd, configPathOpt );
		let concurrentRequestLimit = parseInt( program.opts().concurrentRequestLimit, 10 );
		if ( isNaN( concurrentRequestLimit) || concurrentRequestLimit < 1 ) {
			concurrentRequestLimit = 1;
		}
		const testFunctionName = program.opts().testFunctionName;

		if (typeof testFunctions[testFunctionName] !== 'function' ) {
			console.log( `Unknown test function "${ testFunctionName }"` );
			process.exit( 2 );
		}
		const testFunction = testFunctions[testFunctionName];

		return new ScreenshotsRequest( configPath, screenshotPath, campaignName, concurrentRequestLimit, testFunction );
	}
}
