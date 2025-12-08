import { strict as assert } from 'assert';
import { Dimension } from '../../../src/Model/Dimension';
import {
	INVALID_REASON_REQUIRED,
	INVALID_REASON_RESOLUTION,
	TestCase,
	TestCaseFinishedState
} from '../../../src/Model/TestCase'

describe('TestCase', () => {
	const dimensions = [Dimension.PLATFORM, Dimension.RESOLUTION, Dimension.BANNER];

	it('is valid with correct data', () => {
		const testCase = TestCase.create(
			dimensions,
			[ 'chrome_linux', '1280x960', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		assert.ok( testCase.isValid() );
	});

	it('is not valid with incorrect data', () => {
		const testCase = TestCase.create(
			[],
			[],
			'https://de.wikipedia.org'
		);

		assert.ok( !testCase.isValid() );
		assert.strictEqual( testCase.getLastStateDescription(), INVALID_REASON_REQUIRED );
	});

	it('is not valid when operating system does not allow resolution', () => {
		const testCase = TestCase.create(
			dimensions,
			[ 'chrome_macos', '800x600', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		assert.ok( !testCase.isValid() );
		assert.strictEqual( testCase.getLastStateDescription(), INVALID_REASON_RESOLUTION );
	});

	it('creates screenshot name', () => {

		const testCase = TestCase.create(
			dimensions,
			[ 'chrome_win7', '1280x960', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		assert.strictEqual( 'chrome_win7__1280x960__ctrl.png', testCase.getScreenshotFilename() );
	});

	it('creates screenshot name for dark mode', () => {

		const testCaseDark = TestCase.create(
			[ ...dimensions, Dimension.DARKMODE ],
			[ 'chrome_win7', '1280x960', 'ctrl', 'on' ],
			'https://de.wikipedia.org'
		);

		const testCaseLight = TestCase.create(
			[ ...dimensions, Dimension.DARKMODE ],
			[ 'chrome_win7', '1280x960', 'ctrl', 'off' ],
			'https://de.wikipedia.org'
		);

		assert.strictEqual( 'chrome_win7__1280x960__ctrl__dark.png', testCaseDark.getScreenshotFilename() );
		assert.strictEqual( 'chrome_win7__1280x960__ctrl__light.png', testCaseLight.getScreenshotFilename() );
	});

	it('cannot be created when dimension keys and values have different number of elements', () => {
		assert.throws(() => TestCase.create(
			[Dimension.PLATFORM],
			['firefox', '1024x768'],
			'https://de.wikipedia.org'
		))
	} );

	it( 'returns description of last state', () => {
		const testCase = TestCase.create(
			dimensions,
			[ 'chrome_win7', '1280x960', 'ctrl' ],
			'https://de.wikipedia.org'
		);
		testCase.updateState( new TestCaseFinishedState( 'Successfully finished' ) );


		assert.strictEqual( 'Successfully finished', testCase.getLastStateDescription() );
	} );

	it( 'returns name of last state', () => {
		const newTestCase = TestCase.create(
			dimensions,
			[ 'chrome_win7', '1280x960', 'ctrl' ],
			'https://de.wikipedia.org'
		);
		const finishedTestCase = TestCase.create(
			dimensions,
			[ 'chrome_win7', '1280x960', 'ctrl' ],
			'https://de.wikipedia.org'
		);
		finishedTestCase.updateState( new TestCaseFinishedState( 'Successfully finished' ) );

		assert.equal( newTestCase.getLastStateName(), 'pending' );
		assert.equal( finishedTestCase.getLastStateName(), 'finished' );
	} );

	it( 'can validate dimensions', () => {
		const testCase = TestCase.create(
			dimensions,
			[ 'chrome_win7', '1280x960', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		const fewerDimensions = [Dimension.PLATFORM, Dimension.RESOLUTION];
		const differentDimensions = [Dimension.PLATFORM, Dimension.RESOLUTION, Dimension.ORIENTATION];

		assert.ok( testCase.containsDimensions( dimensions ) );
		assert.ok( !testCase.containsDimensions( fewerDimensions ) );
		assert.ok( !testCase.containsDimensions( differentDimensions ) );
	} )
});
