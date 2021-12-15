import { strict as assert } from 'assert';
import {BANNER, RESOLUTION, PLATFORM} from "../../../src/Model/Dimensions";
import { TestCase, INVALID_REASON_REQUIRED, INVALID_REASON_RESOLUTION } from "../../../src/Model/TestCase"

describe('TestCase', () => {
	const dimensions = [PLATFORM, RESOLUTION, BANNER];

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

	it('cannot be created when dimension keys and values have different number of elements', () => {
		assert.throws(() => TestCase.create(
			[PLATFORM],
			['firefox', '1024x768'],
			'https://de.wikipedia.org'
		))
	} )
});
