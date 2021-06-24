import path from "path";
const { multiremote } = require('webdriverio');
import {createImageWriter} from "./src/writeImageData";

export const CONNECTION = {
	user: process.env.TB_KEY,
	key: process.env.TB_SECRET,
	services: [
		['testingbot', {
			tbTunnel: false
		}]
	],
	logLevel: "trace",
	connectionRetryCount: 1
}

/*
const capabilities = {
		ie11: {capabilities: {platformName: 'WIN7', browserName: 'internet explorer', browserVersion: 11}, ...CONNECTION},
		edge: {capabilities: {platformName: 'WIN10', browserName: 'microsoftedge', browserVersion: 91}, ...CONNECTION},
		chrome_linux: {capabilities: {platformName: 'LINUX', browserName: 'chrome', browserVersion: 91}, ...CONNECTION},
		chrome_win10: {capabilities: {platformName: 'WIN10', browserName: 'chrome', browserVersion: 91}, ...CONNECTION},
		firefox_win10: {capabilities:{platformName: 'WIN10', browserName: 'firefox', browserVersion: 89}, ...CONNECTION},
		firefox_macos: {capabilities:{platformName: 'CATALINA', browserName: 'firefox', browserVersion: 89}, ...CONNECTION},
		firefox_linux: {capabilities:{platformName: 'LINUX', browserName: 'firefox', browserVersion: 89}, ...CONNECTION}
	}
;

 */
const capabilities = {

	'samsung_s10': {capabilities: { browserName : 'Chrome',platform : 'Android', browserVersion : '10.0',platformName : 'Android', deviceName : 'Galaxy S10'},  ...CONNECTION},
	'samsung_s10_landscape': {capabilities: { browserName : 'Chrome',platform : 'Android', browserVersion : '10.0',platformName : 'Android', deviceName : 'Galaxy S10', orientation: "LANDSCAPE"},  ...CONNECTION},

	'nexus_6': {capabilities: { browserName : 'browser',platform : 'Android', browserVersion : '6.0',platformName : 'Android', deviceName : 'Nexus 6'},  ...CONNECTION},

	 'iphone_xs_max': {capabilities: { browserName : 'safari', platform : 'iOS', browserVersion : '12.1', platformName : 'iOS', deviceName : 'iPhone XS Max' },  ...CONNECTION},
	 'iphone_xs_max_landscape': {capabilities: { browserName : 'safari', platform : 'iOS', browserVersion : '12.1', platformName : 'iOS', deviceName : 'iPhone XS Max', orientation: "LANDSCAPE" },  ...CONNECTION},

	'iphone_se': {capabilities: { browserName : 'safari', platform : 'iOS', browserVersion : '11.4', platformName : 'iOS', deviceName : 'iPhone SE' },  ...CONNECTION},
	'iphone_se_landscape': {capabilities: { browserName : 'safari', platform : 'iOS', browserVersion : '11.4', platformName : 'iOS', deviceName : 'iPhone SE', orientation: "LANDSCAPE" },  ...CONNECTION},

};

(async () => {
	const browsers = await multiremote( capabilities );
	// TODO check with smaller browser set if it works when the directory does not exist
	const imageWriter = await createImageWriter( path.join( __dirname, 'banner-shots/test' ) );

	const shoot = async browser => {
		// const URL = 'https://de.m.wikipedia.org/wiki/Wikipedia:Hauptseite?banner=B20_WMDE_Test_05_var';
		const URL = 'https://de.m.wikipedia.org/wiki/Wikipedia:Hauptseite?banner=B20_WMDE_Test_Mobile';
		const start = new Date();

		await browsers[browser].url( URL )

		const banner = await browsers[browser].$('.banner-position--state-finished');
		await banner.waitForExist( {
			timeout: 30000,
			timeoutMsg: `Page did not contain class "banner-position--state-finished" for banner`
		} );

		const shot = await browsers[browser].takeScreenshot();

		await imageWriter( shot, browser + '.png');

		await browsers[browser].deleteSession();

		const end = new Date();

		return `We took a screenshot for ${browser} of ${shot.toString().length} bytes, starting at ${start} ending at ${end}, took ${end-start} milliseconds`;
	}

	Promise.all( Object.keys(capabilities).map(shoot)).then(output => output.map(console.log));


})().catch((e) => console.error(e));
