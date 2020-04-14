import { strict as assert } from 'assert';
import {TestMatrix, BANNER, RESOLUTION, BROWSER, OPERATING_SYSTEM, DEVICE} from "../../src/TestMatrix";
import { CapabilityFactory } from "../../src/CapabilityFactory";



describe('getCapabilities', () => {

	it( 'builds capabilities for OS, browser, and resolution', () => {
		const matrix = new TestMatrix();
		matrix.addDimension( BROWSER, [ 'chrome' ] )
			.addDimension( OPERATING_SYSTEM, [ 'macos' ] )
			.addDimension( RESOLUTION, ['1280x1200'] )
			.build();

		const allPossibilities = matrix.getDimensionArray();
		assert.strictEqual( allPossibilities.length, 1 ); // Just a sanity check

		const factory = new CapabilityFactory( matrix, { 'sauce:options': {} } );
		assert.deepEqual( factory.getCapabilities( allPossibilities[0] ), {
			browserName: 'chrome',
			platformName: 'macOS 10.15',
			'sauce:options': {
				screenResolution: '1280x1200'
			}
		} );
	} );

	it( 'overrides values for browser, OS and resolution when given a device', () => {
		const matrix = new TestMatrix();
		matrix.addDimension( DEVICE, ['iphone_xs_max'])
			.addDimension( BROWSER, [ 'chrome' ] )
			.addDimension( OPERATING_SYSTEM, [ 'macos' ])
			.addDimension( RESOLUTION, ['1280'])
			.build();

		const allPossibilities = matrix.getDimensionArray();
		assert.strictEqual( allPossibilities.length, 1 ); // Just a sanity check

		const factory = new CapabilityFactory( matrix, {} );
		assert.deepEqual( factory.getCapabilities( allPossibilities[0] ), {
			browserName: 'Safari',
			deviceName: 'iPhone XS Simulator',
			deviceOrientation: 'portrait',
			platformName: 'iOS'
		} );

	} )
} );