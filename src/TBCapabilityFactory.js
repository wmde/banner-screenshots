import {DEVICE, PLATFORM, ORIENTATION, RESOLUTION} from "./Dimensions";

const DEVICE_NAMES = new Map( [
	[ 'iphone_xs_max', { browserName : 'safari', platform : 'iOS', browserVersion : '12.1', platformName : 'iOS', deviceName : 'iPhone XS Max' } ],
	[ 'iphone_5s', { browserName : 'safari', platform : 'iOS', browserVersion : '12.1', platformName : 'iOS', deviceName : 'iPhone 5s' } ],
	[ 'samsung_s6', {browserName : 'browser',platform : 'Android', browserVersion : '6.0',platformName : 'Android', deviceName : 'Galaxy S6'} ],
	[ 'samsung_s9_plus', { browserName : 'Chrome',platform : 'Android', browserVersion : '9.0',platformName : 'Android', deviceName : 'Galaxy S9'} ],
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
			capabilityResult = DEVICE_NAMES.get( device );
			capabilityResult.deviceOrientation = dimensions.has( ORIENTATION ) ? dimensions.get( ORIENTATION ) : 'portrait';
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
