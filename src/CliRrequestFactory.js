import meow from "meow";
import path from "path";
import testFunctions from "./test_functions";
import {ScreenshotsRequest} from "./ScreenshotGenerator";

export class CliRequestFactory {

	constructor( cwd ) {
		this.cwd = cwd
	}

	getRequestParameters() {
		const cli = meow(
			`
	Usage
		node -r esm index.js [OPTION...] <CAMPAIGN_NAME>

		<CAMPAIGN_NAME>			Name of the campaign to create screenshots of
		
	Options
		--screenshotPath, -s 		Path to directory containing campaign directories with metadata, default: "banner-shots"
		--configName, -c		Path to the campaign config file (toml), default: "campaign_info.toml"
		--concurrentRequestLimit, -l 	Amount of concurrent requests to saucelab, default: 4
		--testFunctionName, -t		Name of the test function, default: "shootBanner"
		
	Examples
	$ node -r esm index.js desktop
	`,
			{
				description: 'Create screenshots of a certain banner campaign',
				input: [],
				flags: {
					screenshotPath: {
						alias: 's',
						type: 'string',
						default: 'banner-shots'
					},
					configPath: {
						alias: 'c',
						type: 'string',
						default: 'campaign_info.toml'
					},
					concurrentRequestLimit: {
						alias: 'l',
						type: 'number',
						default: 5
					},
					testFunctionName: {
						alias: 't',
						type: 'string',
						default: 'shootBanner'
					}
				}
			} );
		if (typeof cli.input[0] !== 'string' ) {
			console.log( `ERROR: Please provide an existing campaign name! \nSee --help for usage instructions.` );
			process.exit( 2 );
		}
		const campaignName = cli.input[0];
		const screenshotPath = path.join( this.cwd, cli.flags.screenshotPath.toString() );
		const configPath = path.join( this.cwd, cli.flags.configPath.toString() );
		const concurrentRequestLimit = cli.flags.concurrentRequestLimit;
		const testFunctionName = cli.flags.testFunctionName;

		if (typeof testFunctions[testFunctionName] !== 'function' ) {
			console.log( `Unknown test function "${ testFunctionName }"` );
			process.exit( 2 );
		}
		const testFunction = testFunctions[testFunctionName];

		return new ScreenshotsRequest( configPath, screenshotPath, campaignName, concurrentRequestLimit, testFunction );
	}
}
