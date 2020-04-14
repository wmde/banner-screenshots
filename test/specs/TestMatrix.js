import { strict as assert } from 'assert';
import {TestMatrix, BANNER, DEVICE, BROWSER, OPERATING_SYSTEM} from "../../src/TestMatrix";



describe('TestMatrix', () => {
	it('Builds a dimension array', () => {
		const matrix = new TestMatrix();
		matrix.addDimension( BANNER, [ 'ctrl', 'var' ] )
			.addDimension( DEVICE, [ 'iphone_xs_max', 'iphone_se' ])
			.build();

		assert.deepEqual( matrix.getDimensions(), [ BANNER, DEVICE ] );
		assert.deepEqual( matrix.getDimensionArray(), [
			[ 'ctrl', 'iphone_xs_max' ],
			[ 'ctrl', 'iphone_se' ],
			[ 'var', 'iphone_xs_max' ],
			[ 'var', 'iphone_se' ],
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

	it('Throws an error on build when not passed required dimensions', () => {
		const expectedError = 'Dimensions are missing a required column, please specify a device name or a combination of browser and OS';

		assert.throws(() => {
			const matrix = new TestMatrix();
			matrix.build();
		}, Error, expectedError);

		assert.throws(() => {
			const matrix = new TestMatrix();
			matrix.addDimension( OPERATING_SYSTEM, [ 'linux' ])
				.build();
		}, Error, expectedError);

		assert.throws(() => {
			const matrix = new TestMatrix();
			matrix.addDimension( BROWSER, [ 'edge' ])
				.build();
		}, Error, expectedError);
	} );

	it('Can build a matrix from dimension values', () => {
		const matrix = new TestMatrix();
		matrix.addDimension( BANNER, [ 'ctrl', 'var' ] )
			.addDimension( DEVICE, [ 'iphone_xs_max', 'iphone_se' ])
			.build();

		const matrixValues = matrix.getDimensionArray();
		const mapFirstRow = matrix.getDimensionMap( matrixValues[0] );
		const mapSecondRow = matrix.getDimensionMap( matrixValues[1] );

		assert.ok( mapFirstRow.has( BANNER ) );
		assert.ok( mapFirstRow.has( DEVICE ) );
		assert.ok( !mapFirstRow.has( BROWSER ) );
		assert.strictEqual( mapFirstRow.get( BANNER ), 'ctrl' );
		assert.strictEqual( mapFirstRow.get( DEVICE ), 'iphone_xs_max' );
		assert.strictEqual( mapSecondRow.get( DEVICE ), 'iphone_se' );

	} );

} );
