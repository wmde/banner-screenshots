import { strict as assert } from 'assert';
import {TestCaseGenerator} from "../../src/TestCaseGenerator.js";
import {BANNER, DEVICE, PLATFORM} from "../../src/Dimensions.js";

const BANNER_URL = 'http://de.wikipedia.org/{{PLACEHOLDER}}';
const PLACEHOLDER = '{{PLACEHOLDER}}';
const PAGE_NAMES = [ ['ctrl', 'B19WMDE_21_191221_ctrl'], [ 'var', 'B19WMDE_21_191221_var' ] ];

describe('TestMatrix', () => {
	it('Builds test cases', () => {
		const generator = new TestCaseGenerator(
			new Map( PAGE_NAMES ),
			BANNER_URL,
			PLACEHOLDER
		);

		generator.addDimension( BANNER, [ 'ctrl', 'var' ] )
			.addDimension( DEVICE, [ 'iphone_xs_max', 'iphone_se' ])
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
			const matrix = new TestCaseGenerator();
			matrix.build();
		}, Error);

		assert.throws(() => {
			const matrix = new TestCaseGenerator(
				new Map( PAGE_NAMES ),
				BANNER_URL,
				PLACEHOLDER
			);
			matrix.addDimension( PLATFORM, [ 'firefox_linux' ])
				.build();
		}, Error);
	} );

	it('Throws an error on build when not passed required url information', () => {

		assert.throws(() => {
			const matrix = new TestCaseGenerator();
			matrix.build();
		}, Error);
	} );

	it('creates banner url for testCase', () => {

		const generator = new TestCaseGenerator(
			new Map( PAGE_NAMES ),
			BANNER_URL,
			PLACEHOLDER
		);

		generator.addDimension( BANNER, [ 'ctrl' ] )
			.addDimension( DEVICE, [ 'iphone_xs_max' ])
			.build();

		const testCases = generator.getTestCases();
		const testCase = testCases[0];

		assert.strictEqual( 'http://de.wikipedia.org/B19WMDE_21_191221_ctrl', testCase.getBannerUrl() );
	});
} );
