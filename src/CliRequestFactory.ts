import { Command } from 'commander';
import * as path from "path";
import { testFunctionExists } from "./test_functions";
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

		const testFunctionName = program.opts().testFunctionName;
		if (!testFunctionExists(testFunctionName ) ) {
			console.log( `Unknown test function "${ testFunctionName }"` );
			process.exit( 2 );
		}

		return new ScreenshotsRequest( configPath, screenshotPath, campaignName, testFunctionName );
	}
}
