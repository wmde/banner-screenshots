const { multiremote } = require('webdriverio');

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

(async () => {
	const browsers = await multiremote( capabilities );

	const shoot = async browser => {
		const URL = 'https://de.m.wikipedia.org/wiki/Wikipedia:Hauptseite?banner=B20_WMDE_Test_05_var';
		const start = new Date();

		await browsers[browser].url( URL )

		const banner = await browsers[browser].$('.banner-position--state-finished');
		await banner.waitForExist( {
			timeout: 30000,
			timeoutMsg: `Page did not contain class "banner-position--state-finished" for banner`
		} );

		const shot = await browsers[browser].takeScreenshot();

		await browsers[browser].deleteSession();

		const end = new Date();

		return `We took a screenshot for ${browser} of ${shot.toString().length} bytes, starting at ${start} ending at ${end}, took ${end-start} milliseconds`;
	}

	Promise.all( Object.keys(capabilities).map(shoot)).then(output => output.map(console.log));


})().catch((e) => console.error(e));
