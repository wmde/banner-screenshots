import {BROWSER, DEVICE, OPERATING_SYSTEM, ORIENTATION, RESOLUTION} from "./TestMatrix";

const OPERATING_SYSTEM_NAMES = new Map( [
	[ 'win7', 'Windows 7' ],
	[ 'win10', 'Windows 10' ],
	[ 'macos', 'macOS 10.14' ],
	[ 'linux', 'Linux' ],
] );

const BROWSER_NAMES = new Map( [
	[ 'edge', 'MicrosoftEdge' ],
	[ 'ie11', 'internet explorer' ],
	[ 'firefox', 'firefox' ],
	[ 'chrome', 'chrome' ],
	[ 'safari', 'safari' ],
] );

const DEVICE_NAMES = new Map( [
	[ 'iphone_xs_max', { deviceName: 'iPhone XS Max Simulator', platformName: 'iOS', browserName: 'Safari', appiumVersion: '1.16.0', platformVersion: '13.2' } ],
	[ 'iphone_5s', { deviceName: 'iPhone 5s Simulator', platformName: 'iOS', browserName: 'Safari', appiumVersion: '1.13.0', platformVersion: '12.4' } ],
	[ 'samsung_s6', { deviceName: 'Samsung Galaxy S6 GoogleAPI Emulator', platformName: 'Android', browserName: 'Chrome', platformVersion: '7.0', appiumVersion: '1.11.1' } ],
	[ 'samsung_s9_plus', { deviceName: 'Samsung Galaxy S9 Plus WQHD GoogleAPI Emulator', platformName: 'Android', browserName: 'Chrome', platformVersion: '8.1', appiumVersion: '1.16.0' } ],

] );


export class CapabilityFactory {
	/**
	 *
	 * @param {TestMatrix} testMatrix
	 * @param {object} defaultCapabilities
	 */
	constructor( defaultCapabilities ) {
		this.defaultCapabilities = defaultCapabilities;
	}

	/**
	 *
	 * @param {Map<string,string>} dimensions
	 * @return object
	 */
	getCapabilities( dimensions) {
		let capabilityResult = Object.assign( {}, this.defaultCapabilities ) ;
		// TODO make it more flexible for other vendors than saucelabs or use a deep clone function

		if ( dimensions.has( DEVICE ) ) {
			capabilityResult = DEVICE_NAMES.get( dimensions.get( DEVICE ) );
			capabilityResult.deviceOrientation = dimensions.has( ORIENTATION ) ? dimensions.get( ORIENTATION ) : 'portrait';
			return capabilityResult;
		}
		const browserName = dimensions.get( BROWSER );
		capabilityResult.browserName = BROWSER_NAMES.get( browserName );

		capabilityResult.platformName  = OPERATING_SYSTEM_NAMES.get( dimensions.get( OPERATING_SYSTEM ) );

		if ( dimensions.has( RESOLUTION ) ) {
			// todo make more flexible than just saucelabs
			capabilityResult['sauce:options'].screenResolution = dimensions.get( RESOLUTION );
		}

		if ( capabilityResult.platformName === 'Linux' ) {
			delete capabilityResult['sauce:options'];
			capabilityResult.platform = capabilityResult.platformName;
			delete capabilityResult.platformName;
		}

		return capabilityResult;
	}

}
