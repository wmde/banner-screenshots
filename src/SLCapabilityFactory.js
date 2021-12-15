import { Dimension } from "./Model/Dimension.ts";

const DEVICE_NAMES = new Map( [
	[ 'iphone_xs_max', { deviceName: 'iPhone XS Max Simulator', platformName: 'iOS', browserName: 'Safari', appiumVersion: '1.16.0', platformVersion: '13.2' } ],
	[ 'iphone_5s', { deviceName: 'iPhone 5s Simulator', platformName: 'iOS', browserName: 'Safari', appiumVersion: '1.13.0', platformVersion: '12.4' } ],
	[ 'samsung_s6', { deviceName: 'Samsung Galaxy S6 GoogleAPI Emulator', platformName: 'Android', browserName: 'Chrome', platformVersion: '7.0', appiumVersion: '1.11.1' } ],
	[ 'samsung_s9_plus', { deviceName: 'Samsung Galaxy S9 Plus WQHD GoogleAPI Emulator', platformName: 'Android', browserName: 'Chrome', platformVersion: '8.1', appiumVersion: '1.16.0' } ],

] );

const PLATFORM_NAMES = new Map( [

		[ 'ie11', { platformName: 'Windows 7', browserName: 'internet explorer' } ],
		[ 'edge', { platformName: 'Windows 10', browserName: 'MicrosoftEdge' } ],
		[ 'firefox_win10', { platformName: 'Windows 10', browserName: 'firefox' } ],
		[ 'chrome_win10', { platformName: 'Windows 10', browserName: 'chrome' } ],

		[ 'firefox_linux', { platformName: 'Linux', browserName: 'firefox' } ],
		[ 'chrome_linux', { platformName: 'Linux', browserName: 'chrome' } ],

		[ 'firefox_macos', { platformName: 'macOS 10.14', browserName: 'firefox' } ],
		[ 'chrome_macos', { platformName: 'macOS 10.14', browserName: 'chrome' } ],
		[ 'safari', { platformName: 'macOS 10.14', browserName: 'safari' } ],
] );


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
		if ( this.defaultCapabilities['sauce:options'] ) {
			capabilityResult['sauce:options'] = Object.assign( {}, this.defaultCapabilities['sauce:options'] );
		}

		if ( dimensions.has( Dimension.DEVICE ) ) {
			const device = dimensions.get( Dimension.DEVICE );
			if ( !DEVICE_NAMES.has( device ) ) {
				throw new Error( `Unsupported device: ${device}` )
			}
			capabilityResult = { ...DEVICE_NAMES.get( device ) };
			capabilityResult.deviceOrientation = dimensions.has( Dimension.ORIENTATION ) ? dimensions.get( Dimension.ORIENTATION ) : 'portrait';
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
			capabilityResult['sauce:options'].screenResolution = dimensions.get( Dimension.RESOLUTION );
		}

		// SauceLabs supports only older browsers with one resolution on Linux & uses an old protocol for that
		if ( capabilityResult.platformName === 'Linux' ) {
			delete capabilityResult['sauce:options'];
			capabilityResult.platform = capabilityResult.platformName;
			delete capabilityResult.platformName;
		}

		return capabilityResult;
	}

}
