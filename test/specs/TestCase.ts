import { strict as assert } from 'assert';
import {BANNER, RESOLUTION, PLATFORM} from "../../src/Dimensions.js";
import { TestCase, INVALID_REASON_REQUIRED, INVALID_REASON_RESOLUTION } from "../../src/TestCase.js";

describe('TestCase', () => {
	const dimensions = [PLATFORM, RESOLUTION, BANNER];

	it('is valid with correct data', () => {
		const testCase = new TestCase(
			dimensions,
			[ 'chrome_linux', '1280x960', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		assert.ok( testCase.isValid() );
	});

	it('is not valid with incorrect data', () => {
		const testCase = new TestCase(
			[],
			[],
			'https://de.wikipedia.org'
		);

		assert.ok( !testCase.isValid() );
		assert.strictEqual( testCase.invalidReason, INVALID_REASON_REQUIRED );
	});

	it('is not valid when operating system does not allow resolution', () => {
		const testCase = new TestCase(
			dimensions,
			[ 'chrome_macos', '800x600', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		assert.ok( !testCase.isValid() );
		assert.strictEqual( testCase.invalidReason, INVALID_REASON_RESOLUTION );
	});

	it('creates screenshot name', () => {

		const testCase = new TestCase(
			dimensions,
			[ 'chrome_win7', '1280x960', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		assert.strictEqual( 'chrome_win7__1280x960__ctrl.png', testCase.getScreenshotFilename() );
	});
});
