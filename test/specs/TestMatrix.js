import { strict as assert } from 'assert';
import { TestMatrix } from "../../src/TestMatrix";

describe('TestMatrix', () => {
	it('Build a dimension array', () => {
		const matrix = new TestMatrix();
		matrix.addDimension( 'banner', [ 'ctrl', 'var' ] )
			.addDimension('resolution', [ '1280', '768' ])
			.build();

		assert.deepEqual( matrix.getDimensions(), [ 'banner', 'resolution' ] );
		assert.deepEqual( matrix.getDimensionArray(), [
			[ 'ctrl', '1280' ],
			[ 'ctrl', '768' ],
			[ 'var', '1280' ],
			[ 'var', '768' ],
		] );
	} );
} );
