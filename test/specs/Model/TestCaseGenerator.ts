import { strict as assert } from 'assert';
import {TestCaseGenerator} from "../../../src/Model/TestCaseGenerator";
import { Dimension } from "../../../src/Model/Dimension";
import { PreviewUrl } from '../../../src/Model/PreviewUrl';

const BANNER_URL = new PreviewUrl( 'http://de.wikipedia.org/{{PLACEHOLDER}}' );
const PLACEHOLDER = '{{PLACEHOLDER}}';
const PAGE_NAMES = new Map( [ ['ctrl', 'B19WMDE_21_191221_ctrl'], [ 'var', 'B19WMDE_21_191221_var' ] ] );

describe('TestMatrix', () => {
	it('Builds test cases', () => {
		const generator = new TestCaseGenerator( PAGE_NAMES, BANNER_URL, PLACEHOLDER );

		generator.addDimension( Dimension.BANNER, [ 'ctrl', 'var' ] )
			.addDimension( Dimension.DEVICE, [ 'iphone_xs_max', 'iphone_se' ])
			.build();

		const testCases = generator.getTestCases();

		assert.strictEqual( testCases.length, 4 );

		const testCase = testCases[0];
		assert.deepEqual(
			Array.from( testCase.getDimensions().values() ),
			[ 'ctrl', 'iphone_xs_max' ]
		);
	} );

	it('Throws an error on build when not passed required dimensions', () => {

		assert.throws(() => {
			const generator = new TestCaseGenerator( PAGE_NAMES, BANNER_URL, PLACEHOLDER );
			generator.build();
		}, Error);

		assert.throws(() => {
			const matrix = new TestCaseGenerator(
				new Map( PAGE_NAMES ),
				BANNER_URL,
				PLACEHOLDER
			);
			matrix.addDimension( Dimension.PLATFORM, [ 'firefox_linux' ])
				.build();
		}, Error);
	} );

	it('creates banner url for testCase', () => {

		const generator = new TestCaseGenerator(
			PAGE_NAMES,
			BANNER_URL,
			PLACEHOLDER
		);

		generator.addDimension( Dimension.BANNER, [ 'ctrl' ] )
			.addDimension( Dimension.DEVICE, [ 'iphone_xs_max' ])
			.build();

		const testCases = generator.getTestCases();
		const testCase = testCases[0];

		assert.strictEqual( 'http://de.wikipedia.org/B19WMDE_21_191221_ctrl', testCase.getBannerUrl() );
	});

	it('creates banner urls for  testCases with dark mode', () => {

		const previewUrl = new PreviewUrl( 'http://de.wikipedia.org/{{PLACEHOLDER}}', 'http://de.wikipedia.org/{{PLACEHOLDER}}?darkmode=true' );

		const generator = new TestCaseGenerator(
			PAGE_NAMES,
			previewUrl,
			PLACEHOLDER
		);

		generator.addDimension( Dimension.BANNER, [ 'ctrl' ] )
			.addDimension( Dimension.DEVICE, [ 'iphone_xs_max' ])
			.addDimension( Dimension.DARKMODE, [ 'on', 'off' ] )
			.build();

		const testCases = generator.getTestCases();

		assert.strictEqual( testCases.length, 2 );
		assert.strictEqual( testCases[0].getBannerUrl(), 'http://de.wikipedia.org/B19WMDE_21_191221_ctrl?darkmode=true' );
		assert.strictEqual( testCases[1].getBannerUrl(), 'http://de.wikipedia.org/B19WMDE_21_191221_ctrl' );
	});

} );
