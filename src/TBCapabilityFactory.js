import {DEVICE, PLATFORM, ORIENTATION, RESOLUTION} from "./Dimensions.js";

const DEVICE_NAMES = new Map( [
	//s6 is responding very slowly or not at all
	[ 'samsung_s6', {browserName : 'browser',platform : 'Android', browserVersion : '6.0',platformName : 'Android', deviceName : 'Galaxy S6'} ],
	[ 'samsung_s10', { browserName : 'Chrome',platform : 'Android', browserVersion : '10.0',platformName : 'Android', deviceName : 'Galaxy S10'} ],
	//firefox does not seem to be supported by testingbot at the moment
	// [ 'samsung_s20', { browserName : 'Firefox',platform : 'Android', browserVersion : '10.0',platformName : 'Android', deviceName : 'Galaxy S20'} ],
	[ 'nexus_6', { browserName : 'browser',platform : 'Android', browserVersion : '6.0',platformName : 'Android', deviceName : 'Nexus 6'} ],

	[ 'iphone_xs_max', { browserName : 'safari', platform : 'iOS', browserVersion : '12.1', platformName : 'iOS', deviceName : 'iPhone XS Max' } ],
	[ 'iphone_5s', { browserName : 'safari', platform : 'iOS', browserVersion : '12.1', platformName : 'iOS', deviceName : 'iPhone 5s' } ],
	[ 'iphone_se', { browserName : 'safari', platform : 'iOS', browserVersion : '11.4', platformName : 'iOS', deviceName : 'iPhone SE' } ],
	[ 'iphone_8', { browserName : 'safari', platform : 'iOS', browserVersion : '14.0', platformName : 'iOS', deviceName : 'iPhone 8' } ],
	[ 'iphone_12_mini', { browserName : 'safari', platform : 'iOS', browserVersion : '14.2', platformName : 'iOS', deviceName : 'iPhone 12 mini' } ],
	[ 'iphone_7_plus', { browserName : 'safari', platform : 'iOS', browserVersion : '11.4', platformName : 'iOS', deviceName : 'iPhone 7 Plus' } ],
	[ 'iphone_11_pro_max', { browserName : 'safari', platform : 'iOS', browserVersion : '13.4', platformName : 'iOS', deviceName : 'iPhone 11 Pro Max' } ],
	[ 'ipad_pro_9_7_inch', { browserName : 'safari', platform : 'iOS', browserVersion : '14.2', platformName : 'iOS', deviceName : 'iPad Pro (9.7-inch)' } ],
	[ 'ipad', { browserName : 'safari', platform : 'BIGSUR', browserVersion : '14.2', platformName : 'iOS', deviceName : 'iPad (8th generation)' } ],
	[ 'ipad_mini', { browserName : 'safari', platform : 'MONTEREY', browserVersion : '15.0', platformName : 'iOS', deviceName : 'iPad mini (6th generation)' } ],
	[ 'ipad_pro_12_inch', { browserName : 'safari', platform : 'MONTEREY', browserVersion : '15.0', platformName : 'iOS', deviceName : 'iPad Pro (12.9-inch) (5th generation)' } ],
]);

const PLATFORM_NAMES = new Map( [
	[ 'ie11', 			{ platformName: 'WIN7', browserName: 'internet explorer', browserVersion: 11 } ],
	[ 'edge', 			{ platformName: 'WIN10', browserName: 'microsoftedge', browserVersion: 91 } ],
	[ 'firefox_win10', 	{ platformName: 'WIN10', browserName: 'firefox', browserVersion: 89 } ],
	[ 'chrome_win10', 	{ platformName: 'WIN10', browserName: 'chrome', browserVersion: 91 } ],

	[ 'firefox_linux', { platformName: 'LINUX', browserName: 'firefox', browserVersion: 89 } ],
	[ 'chrome_linux', { platformName: 'LINUX', browserName: 'chrome', browserVersion: 91 } ],

	/* macos 10.15 */
	[ 'chrome_macos', { platformName: 'CATALINA', browserName: 'chrome', browserVersion: 91 } ],
	[ 'firefox_macos', { platformName: 'CATALINA', browserName: 'firefox', browserVersion: 89 } ],
	[ 'safari', { platformName: 'CATALINA', browserName: 'safari', browserVersion: 13 } ],
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

		if ( dimensions.has( DEVICE ) ) {
			const device = dimensions.get( DEVICE );
			if ( !DEVICE_NAMES.has( device ) ) {
				throw new Error( `Unsupported device: ${device}` )
			}
			capabilityResult = { ...DEVICE_NAMES.get( device ) };
			capabilityResult.orientation = dimensions.has( ORIENTATION ) ? dimensions.get( ORIENTATION ).toUpperCase() : 'PORTRAIT';
			return capabilityResult;
		}
		else {
			const platform = dimensions.get( PLATFORM );
			if ( !PLATFORM_NAMES.has( platform ) ) {
				throw new Error( `Unsupported platform: ${platform}` )
			}
			capabilityResult = Object.assign( {}, capabilityResult, PLATFORM_NAMES.get( platform ) );
		}

		if ( dimensions.has( RESOLUTION ) ) {
			capabilityResult['tb:options']['screen-resolution'] = dimensions.get( RESOLUTION );
		}

		return capabilityResult;
	}

}
