import { strict as assert } from 'assert';
import { CapabilityFactory } from "../../src/TBCapabilityFactory";
import { TestCase } from "../../src/TestCase";
import {BANNER, DEVICE, PLATFORM, RESOLUTION} from "../../src/Dimensions";



describe('getTBCapabilities', () => {

	it( 'builds capabilities for platform and resolution', () => {

		const testCase = new TestCase(
			[ PLATFORM, RESOLUTION, BANNER ],
			[ 'chrome_macos', '1280x1200', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		const factory = new CapabilityFactory( { 'tb:options': {screenrecorder: false} } );
		assert.deepEqual( factory.getCapabilities( testCase ), {
			platformName: 'CATALINA',
			browserName: 'chrome',
			browserVersion: 91,
			"tb:options": {
				"screen-resolution": "1280x1200",
				screenrecorder: false
			}
		});
	} );

	it( 'overrides values for platform and resolution when given a device', () => {

		const testCase = new TestCase(
			[ DEVICE, PLATFORM, RESOLUTION, BANNER ],
			[ 'iphone_xs_max', 'chrome_macos', '1280', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		const factory = new CapabilityFactory( {} );
		assert.deepEqual( factory.getCapabilities( testCase ), {
			browserName: "safari",
			browserVersion: "12.1",
			deviceName: "iPhone XS Max",
			orientation: "portrait",
			platform: "iOS",
			platformName: "iOS"
		} );

	} )
} );