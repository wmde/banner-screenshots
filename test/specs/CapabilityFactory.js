import { strict as assert } from 'assert';
import { CapabilityFactory } from "../../src/CapabilityFactory";
import { TestCase } from "../../src/TestCase";
import {BANNER, BROWSER, DEVICE, OPERATING_SYSTEM, RESOLUTION} from "../../src/Dimensions";



describe('getCapabilities', () => {

	it( 'builds capabilities for OS, browser, and resolution', () => {

		const testCase = new TestCase(
			[ BROWSER, OPERATING_SYSTEM, RESOLUTION, BANNER ],
			[ 'chrome', 'macos', '1280x1200', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		const factory = new CapabilityFactory( { 'sauce:options': {} } );
		assert.deepEqual( factory.getCapabilities( testCase ), {
			browserName: 'chrome',
			platformName: 'macOS 10.14',
			'sauce:options': {
				screenResolution: '1280x1200'
			}
		} );
	} );

	it( 'overrides values for browser, OS and resolution when given a device', () => {

		const testCase = new TestCase(
			[ DEVICE, BROWSER, OPERATING_SYSTEM, RESOLUTION, BANNER ],
			[ 'iphone_xs_max', 'chrome', 'macos', '1280', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		const factory = new CapabilityFactory( {} );
		assert.deepEqual( factory.getCapabilities( testCase ), {
			browserName: 'Safari',
			deviceName: 'iPhone XS Simulator',
			deviceOrientation: 'portrait',
			platformName: 'iOS'
		} );

	} )
} );