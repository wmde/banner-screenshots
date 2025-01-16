import { Dimension } from "./Model/Dimension";

const DEVICE_NAMES = new Map( [
	//s6 is responding very slowly or not at all
	[ 'samsung_s6', {browserName : 'browser', platform : 'Android', browserVersion : '6.0',platformName : 'Android', deviceName : 'Galaxy S6', 'wdio:enforceWebDriverClassic': true } ],
	[ 'pixel_3', { browserName : 'Chrome', platform : 'Android', browserVersion : '10.0', platformName : 'Android', deviceName : 'Pixel 3', 'wdio:enforceWebDriverClassic': true } ],
	//firefox does not seem to be supported by testingbot at the moment
	//[ 'samsung_galaxy_s21', { browserName : 'firefox', platform : 'Android', browserVersion : '11.4', platformName : 'Android', deviceName : 'Galaxy S21', 'wdio:enforceWebDriverClassic': true } ],

	[ 'pixel_8', { browserName : 'chrome', platform : 'Android', browserVersion : '14.0',platformName : 'Android', deviceName : 'Pixel 8', 'wdio:enforceWebDriverClassic': true } ],
	[ 'pixel_6a', { browserName : 'chrome', platform : 'Android', browserVersion : '13.0',platformName : 'Android', deviceName : 'Pixel 6a', 'wdio:enforceWebDriverClassic': true } ],

	[ 'iphone_8', { browserName : 'safari', platform : 'iOS', browserVersion : '15.4', platformName : 'iOS', deviceName : 'iPhone 8', 'wdio:enforceWebDriverClassic': true } ],
	[ 'iphone_13_mini', { browserName : 'safari', platform : 'iOS', browserVersion : '15.4', platformName : 'iOS', deviceName : 'iPhone 13 mini', 'wdio:enforceWebDriverClassic': true } ],
	[ 'iphone_15', { browserName : 'safari', platform : 'iOS', browserVersion : '17.5', platformName : 'iOS', deviceName : 'iPhone 15', 'wdio:enforceWebDriverClassic': true } ],
	[ 'iphone_16', { browserName : 'safari', platform : 'iOS', browserVersion : '18.0', platformName : 'iOS', deviceName : 'iPhone 16', 'wdio:enforceWebDriverClassic': true } ],

	// ipad ------------------
	[ 'ipad_mini', { browserName : 'safari', browserVersion : '15.4', platformName : 'iOS', deviceName : 'iPad mini (6th generation)' , 'wdio:enforceWebDriverClassic': true } ],
	[ 'ipad_pro', { browserName : 'safari', browserVersion : '16.2', platformName : 'iOS', deviceName : 'iPad Pro (11-inch) (4th generation)' , 'wdio:enforceWebDriverClassic': true } ],
]);

const PLATFORM_NAMES = new Map( [
	[ 'edge', 			{ platformName: 'WIN11', browserName: 'microsoftedge', browserVersion: 130, 'wdio:enforceWebDriverClassic': true } ],
	[ 'firefox_win10', 	{ platformName: 'WIN11', browserName: 'firefox', browserVersion: 133, 'wdio:enforceWebDriverClassic': true } ],
	[ 'chrome_win10', 	{ platformName: 'WIN10', browserName: 'chrome', browserVersion: 130, 'wdio:enforceWebDriverClassic': true } ],

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
			const deviceName = dimensions.get( Dimension.DEVICE );
			if ( !DEVICE_NAMES.has( deviceName ) ) {
				throw new Error( `Unsupported device: ${deviceName}` )
			}
			capabilityResult = { ...DEVICE_NAMES.get( deviceName ) };
			capabilityResult.orientation = dimensions.has( Dimension.ORIENTATION ) ? dimensions.get( Dimension.ORIENTATION ).toUpperCase() : 'PORTRAIT';
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
