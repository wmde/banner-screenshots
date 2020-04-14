import { strict as assert } from 'assert';
import {TestMatrix, BANNER, RESOLUTION, BROWSER, OPERATING_SYSTEM} from "../../src/TestMatrix";



describe('TestMatrix', () => {
	it('Build a dimension array', () => {
		const matrix = new TestMatrix();
		matrix.addDimension( BANNER, [ 'ctrl', 'var' ] )
			.addDimension( RESOLUTION, [ '1280', '768' ])
			.build();

		assert.deepEqual( matrix.getDimensions(), [ BANNER, RESOLUTION ] );
		assert.deepEqual( matrix.getDimensionArray(), [
			[ 'ctrl', '1280' ],
			[ 'ctrl', '768' ],
			[ 'var', '1280' ],
			[ 'var', '768' ],
		] );
	} );

	it('Excludes combinations of browsers and operating systems', () => {
		const matrix = new TestMatrix();
		matrix.addDimension( BROWSER, [ 'ie11', 'edge', 'safari', 'chrome' ] )
			.addDimension( OPERATING_SYSTEM, [ 'win7', 'win10', 'macos', 'linux' ])
			.build();

		assert.deepEqual( matrix.getDimensionArray(), [
			[ 'ie11', 'win7' ],
			[ 'edge', 'win10' ],
			[ 'safari', 'macos' ],
			[ 'chrome', 'win10' ],
			[ 'chrome', 'macos' ],
			[ 'chrome', 'linux' ],
		] );
	} );
} );
