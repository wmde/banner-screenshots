import { Dimension } from "./Model/Dimension";

// for available platforms for testing, see https://testingbot.com/support/getting-started/browsers.html

const DEVICE_NAMES = new Map( [
	[ 'android_old_chrome', { browserName : 'Chrome', browserVersion : '10.0', platformName : 'Android', 'appium:deviceName' : '*'} ],
	[ 'android_new_chrome', { browserName : 'chrome', browserVersion : '14.0', platformName : 'Android', 'appium:deviceName' : '*' } ],

	// currently no response from testingbot for firefox devices
	//[ 'android_firefox', { browserName : 'firefox', browserVersion : '12.0', platformName : 'Android', 'appium:deviceName' : '*' } ],

	[ 'iphone_old', { browserName : 'safari', browserVersion : '16.0', platformName : 'iOS', 'appium:deviceName' : 'iPhone 14' } ],
	[ 'iphone_small', { browserName : 'safari', browserVersion : '26.0', platformName : 'iOS', 'appium:deviceName' : 'iPhone 17' } ],
	[ 'iphone_new', { browserName : 'safari', browserVersion : '26.0', platformName : 'iOS', 'appium:deviceName' : '*' } ],

	/* ipad */
	[ 'ipad_mini', { browserName : 'safari', browserVersion : '17.2', platformName : 'iOS', 'appium:deviceName' : 'iPad mini (6th generation)' } ],
	[ 'ipad_medium', { browserName : 'safari', browserVersion : '17.5', platformName : 'iOS', 'appium:deviceName' : 'iPad Pro (11-inch) (M4)' } ],
	[ 'ipad_big', { browserName : 'safari', browserVersion : '26.0', platformName : 'iOS', 'appium:deviceName' : 'iPad Pro (13-inch) (M4)' } ],
]);

/**
 * TODO: Remove `wdio:enforceWebDriverClassic: true` once all future browsers support the new Webdriver BiDi protocol that got introduced in 2024
 * - (Webdriver Blog: https://developer.chrome.com/blog/webdriver-bidi)
 * - We had to introduce `wdio:enforceWebDriverClassic` because the new BiDi protocol broke screenshotting with TestingBot
 * - When you update the browser versions, please check if the new versions supports the new WebDriver BiDi standard and remove the property.
 *    This will ensure more informative log entries and smoother tests in the future.
 * @type {Map<string, {'wdio:enforceWebDriverClassic': boolean, browserVersion: number, browserName: string, platformName: string}>}
 */
const PLATFORM_NAMES = new Map( [
	[ 'edge', 			{ platformName: 'WIN11', browserName: 'microsoftedge', browserVersion: 140, 'wdio:enforceWebDriverClassic': true } ],
	[ 'firefox_windows', 	{ platformName: 'WIN11', browserName: 'firefox', browserVersion: 141, 'wdio:enforceWebDriverClassic': true } ],
	[ 'chrome_windows', 	{ platformName: 'WIN10', browserName: 'chrome', browserVersion: 140, 'wdio:enforceWebDriverClassic': true } ],

	[ 'firefox_linux', { platformName: 'LINUX', browserName: 'firefox', browserVersion: 143, 'wdio:enforceWebDriverClassic': true } ],
	[ 'chrome_linux', { platformName: 'LINUX', browserName: 'chrome', browserVersion: 131, 'wdio:enforceWebDriverClassic': true } ],

	/* macos 10.15 */
	[ 'chrome_macos', { platformName: 'CATALINA', browserName: 'chrome', browserVersion: 128, 'wdio:enforceWebDriverClassic': true } ],
	[ 'firefox_macos', { platformName: 'SONOMA', browserName: 'firefox', browserVersion: 143, 'wdio:enforceWebDriverClassic': true } ],
	[ 'safari', { platformName: 'CATALINA', browserName: 'safari', browserVersion: 13, 'wdio:enforceWebDriverClassic': true } ],
]);

export class CapabilityFactory {
	/**
	 *
	 * @param {object} defaultCapabilities
	 */
	constructor( defaultCapabilities ) {
		this.defaultCapabilities = defaultCapabilities;
	}

	/**
	 *
	 * @param {TestCase} testCase
	 * @return object
	 */
	getCapabilities( testCase ) {
		const dimensions = testCase.getDimensions();

		// TODO use deep clone library instead
		let capabilityResult = Object.assign( {}, this.defaultCapabilities ) ;

		if ( dimensions.has( Dimension.DEVICE ) ) {
			const requestedTestPlatform = dimensions.get( Dimension.DEVICE );
			if ( !DEVICE_NAMES.has( requestedTestPlatform ) ) {
				throw new Error( `Unsupported device: ${requestedTestPlatform}` )
			}
			capabilityResult = { ...DEVICE_NAMES.get( requestedTestPlatform ) };

			if( dimensions.has( Dimension.ORIENTATION ) ) {
				capabilityResult['appium:orientation'] = dimensions.has( Dimension.ORIENTATION ) ? dimensions.get( Dimension.ORIENTATION ).toUpperCase() : 'PORTRAIT';
			}

			return capabilityResult;
		}
		else {
			const platform = dimensions.get( Dimension.PLATFORM );
			if ( !PLATFORM_NAMES.has( platform ) ) {
				throw new Error( `Unsupported platform: ${platform}` )
			}
			capabilityResult = Object.assign( {}, capabilityResult, PLATFORM_NAMES.get( platform ) );
		}

		if ( dimensions.has( Dimension.RESOLUTION ) ) {
			capabilityResult['tb:options']['screen-resolution'] = dimensions.get( Dimension.RESOLUTION );
		}

		return capabilityResult;
	}

}
