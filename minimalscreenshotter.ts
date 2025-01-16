import EnvironmentConfig from './src/EnvironmentConfig';
import { remote } from 'webdriverio';
import { BrowserFactory, DEFAULT_CONNECTION_PARAMS } from './src/TBBrowserFactory.js';
import { WebdriverIOConfig } from '@wdio/types/build/Capabilities';
import { promises as fs } from 'fs';

(
async function () {


const config = new EnvironmentConfig();
const connectionOptions: WebdriverIOConfig = {
	...DEFAULT_CONNECTION_PARAMS,
	user: config.testingBotApiKey,
	key: config.testingBotApiSecret,
	capabilities: {
		'tb:options': { screenrecorder: false, 'screen-resolution': "800x600" },
		//browserName: "chrome"
		platformName: 'WIN10',
		browserName: 'microsoftedge',
		browserVersion: '91',
		'wdio:enforceWebDriverClassic': true
	}
};

const browser = await remote(
		connectionOptions
);

await browser.url( 'https://de.wikipedia.org/?banner=B24_WMDE_Desktop_DE_04_ctrl&devMode' )

const shot = await browser.takeScreenshot();

const buff = Buffer.from( shot, 'base64');
await fs.writeFile( 'newScreenshot.png', buff );

await browser.deleteSession();


}) ()
