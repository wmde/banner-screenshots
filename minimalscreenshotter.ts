/**
 * This minimal screenshotting tool allows to test making single screenshots on testingbot
 */

import EnvironmentConfig from './src/EnvironmentConfig';
import { remote } from 'webdriverio';
import { DEFAULT_CONNECTION_PARAMS } from './src/TBBrowserFactory.js';
import {
	RequestedStandaloneCapabilities,
	WebdriverIOConfig,
} from '@wdio/types/build/Capabilities';
import { promises as fs } from 'fs';

( async function () {

	const mobileCapabilities: RequestedStandaloneCapabilities = {
		'tb:options': {
			screenrecorder: false,
		},
		platformName: 'Android',
		browserName: 'chrome',
		browserVersion: '14.0',
		'appium:orientation': 'LANDSCAPE',
		"appium:deviceName": 'Pixel 8'
	}

	const desktopCapabilities: RequestedStandaloneCapabilities = {
		'tb:options': {
			screenrecorder: false,
			'screen-resolution': "800x600"
		},
		platformName: 'WIN10',
		browserName: 'microsoftedge',
		browserVersion: '91',
		'wdio:enforceWebDriverClassic': true
	}

	const config = new EnvironmentConfig();
	const connectionOptions: WebdriverIOConfig = {
		...DEFAULT_CONNECTION_PARAMS,
		user: config.testingBotApiKey,
		key: config.testingBotApiSecret,
		capabilities: mobileCapabilities,
		logLevel: "info"
	};

	const browser = await remote(
			connectionOptions
	);

	//desktop
	// await browser.url( 'https://de.wikipedia.org/?banner=B24_WMDE_Desktop_DE_04_ctrl&devMode' );

	//mobile
	await browser.url( 'https://de.m.wikipedia.org/?banner=B24_WMDE_Mobile_DE_04_ctrl&devMode' );

	await browser.pause(30000)
	const shot = await browser.takeScreenshot();

	const buff = Buffer.from( shot, 'base64');
	await fs.writeFile( 'newScreenshot.png', buff );

	await browser.deleteSession();


}) ()
