import { strict as assert } from 'assert';
import { SLCapabilityFactory } from "../../src/SLCapabilityFactory";
import { TestCase } from "../../src/TestCase";
import {BANNER, DEVICE, PLATFORM, RESOLUTION} from "../../src/Dimensions";



describe('getSLCapabilities', () => {

	it( 'builds capabilities for platform and resolution', () => {

		const testCase = new TestCase(
			[ PLATFORM, RESOLUTION, BANNER ],
			[ 'chrome_macos', '1280x1200', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		const factory = new SLCapabilityFactory( { 'sauce:options': {} } );
		assert.deepEqual( factory.getCapabilities( testCase ), {
			browserName: 'chrome',
			platformName: 'macOS 10.14',
			'sauce:options': {
				screenResolution: '1280x1200'
			}
		} );
	} );

	it( 'overrides values for platform and resolution when given a device', () => {

		const testCase = new TestCase(
			[ DEVICE, PLATFORM, RESOLUTION, BANNER ],
			[ 'iphone_xs_max', 'chrome_macos', '1280', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		const factory = new SLCapabilityFactory( {} );
		assert.deepEqual( factory.getCapabilities( testCase ), { 
			deviceName: 'iPhone XS Max Simulator', 
			deviceOrientation: "portrait",
			platformName: 'iOS', 
			browserName: 'Safari', 
			appiumVersion: '1.16.0', 
			platformVersion: '13.2' 
		} );

	} )
} );