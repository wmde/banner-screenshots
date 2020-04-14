import {BROWSER, DEVICE, OPERATING_SYSTEM, ORIENTATION, RESOLUTION} from "./TestMatrix";

const OPERATING_SYSTEM_NAMES = new Map( [
	[ 'win7', 'Windows 7' ],
	[ 'win10', 'Windows 10' ],
	[ 'macos', 'macOS 10.15' ],
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
	[ 'iphone_xs_max', { deviceName: 'iPhone XS Simulator', platformName: 'iOS', browserName: 'Safari' } ],
	[ 'iphone_se', { deviceName: 'iPhone SE Simulator', platformName: 'iOS', browserName: 'Safari' } ],
	[ 'iphone_se', { deviceName: 'iPhone SE Simulator', platformName: 'iOS', browserName: 'Safari' } ],
	[ 'samsung_s9', { deviceName: 'Samsung Galaxy S9 Plus FHD GoogleAPI Emulator', platformName: 'Android', browserName: 'Chrome', platformVersion: '8.1' } ],

] );


export class CapabilityFactory {
	/**
	 *
	 * @param {TestMatrix} testMatrix
	 * @param {object} defaultCapabilities
	 */
	constructor( testMatrix, defaultCapabilities ) {
		this.testMatrix = testMatrix;
		this.defaultCapabilities = defaultCapabilities;
	}

	/**
	 *
	 * @param {array} capabilities (output of TestMatrix.getDimensionArray)
	 * @return object
	 */
	getCapabilities( capabilities) {
		const dimensions = this.testMatrix.getDimensions();
		const capMap = new Map( capabilities.map( (v, i) => [dimensions[i], v] ) );
		let capabilityResult = Object.assign( {}, this.defaultCapabilities ) ;
		// TODO make it more flexible for other vendors than saucelabs or use a deep clone function
		if ( this.defaultCapabilities['sauce:options'] ) {
			capabilityResult['sauce:options'] = Object.assign( {}, this.defaultCapabilities['sauce:options'] );
		}
		if ( capMap.has( DEVICE ) ) {
			capabilityResult = DEVICE_NAMES.get( capMap.get( DEVICE ) );
			capabilityResult.deviceOrientation = capMap.has( ORIENTATION ) ? capMap.get( ORIENTATION ) : 'portrait';
			return capabilityResult;
		}
		capabilityResult.browserName = BROWSER_NAMES.get( capMap.get( BROWSER ) );
		capabilityResult.platformName = OPERATING_SYSTEM_NAMES.get( capMap.get( OPERATING_SYSTEM ) );
		if ( capMap.has( RESOLUTION ) ) {
			// todo make more flexible than just saucelabs
			capabilityResult['sauce:options'].screenResolution = capMap.get( RESOLUTION );
		}
		return capabilityResult;
	}

}
