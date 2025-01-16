import { Dimension } from "./Model/Dimension";

// for available platforms for testing, see https://testingbot.com/support/getting-started/browsers.html

const DEVICE_NAMES = new Map( [
	[ 'android_old_chrome', { browserName : 'Chrome', browserVersion : '10.0', platformName : 'Android', deviceName : '*'} ],
	[ 'android_new_chrome', { browserName : 'chrome', browserVersion : 'latest', platformName : 'Android', deviceName : '*' } ],

	// currently no response from testingbot
	//[ 'android_firefox', { browserName : 'firefox', browserVersion : 'latest', platformName : 'Android', deviceName : '*' } ],

	[ 'iphone_old', { browserName : 'safari', browserVersion : '15.4', platformName : 'iOS', deviceName : 'iPhone 8' } ],
	[ 'iphone_small', { browserName : 'safari', browserVersion : '15.4', platformName : 'iOS', deviceName : 'iPhone 13 mini' } ],
	[ 'iphone_new', { browserName : 'safari', browserVersion : 'latest', platformName : 'iOS', deviceName : '*' } ],

	// ipad ------------------
	[ 'ipad_mini', { browserName : 'safari', browserVersion : '15.4', platformName : 'iOS', deviceName : 'iPad mini (6th generation)' } ],
	[ 'ipad_medium', { browserName : 'safari', browserVersion : '16.2', platformName : 'iOS', deviceName : 'iPad Pro (11-inch) (4th generation)' } ],
	[ 'ipad_big', { browserName : 'safari', browserVersion : '16.2', platformName : 'iOS', deviceName : 'iPad Pro (11-inch) (4th generation)' } ],
]);

const PLATFORM_NAMES = new Map( [
	[ 'edge', 			{ platformName: 'WIN11', browserName: 'microsoftedge', browserVersion: 130, 'wdio:enforceWebDriverClassic': true } ],
	[ 'firefox_windows', 	{ platformName: 'WIN11', browserName: 'firefox', browserVersion: 133, 'wdio:enforceWebDriverClassic': true } ],
	[ 'chrome_windows', 	{ platformName: 'WIN10', browserName: 'chrome', browserVersion: 130, 'wdio:enforceWebDriverClassic': true } ],

	[ 'firefox_linux', { platformName: 'LINUX', browserName: 'firefox', browserVersion: 133, 'wdio:enforceWebDriverClassic': true } ],
	[ 'chrome_linux', { platformName: 'LINUX', browserName: 'chrome', browserVersion: 131, 'wdio:enforceWebDriverClassic': true } ],

	/* macos 10.15 */
	[ 'chrome_macos', { platformName: 'CATALINA', browserName: 'chrome', browserVersion: 128, 'wdio:enforceWebDriverClassic': true } ],
	[ 'firefox_macos', { platformName: 'CATALINA', browserName: 'firefox', browserVersion: 132, 'wdio:enforceWebDriverClassic': true } ],
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

			//deviceName is not supported as a base level capability anymore, using appium specification instead
			capabilityResult['appium:deviceName'] = DEVICE_NAMES.get( requestedTestPlatform ).deviceName;
			delete capabilityResult['deviceName'];

			if( dimensions.has( Dimension.ORIENTATION ) ) {
				//orientation is not supported as a base level capability anymore, using appium specification instead
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
