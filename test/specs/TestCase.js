import {BANNER, BROWSER, OPERATING_SYSTEM, RESOLUTION} from "../../src/Dimensions";

const assert = require('assert');

import { TestCase, INVALID_REASON_REQUIRED, INVALID_REASON_BROWSER, INVALID_REASON_RESOLUTION } from "../../src/TestCase";

describe('TestCase', () => {
	const dimensions = [OPERATING_SYSTEM, BROWSER, RESOLUTION, BANNER];

	it('is valid with correct data', () => {
		const testCase = new TestCase(
			dimensions,
			[ 'linux', 'chrome', '1280x960', 'ctrl' ],
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

	it('is not valid when operating system does not allow browser', () => {
		const testCase = new TestCase(
			dimensions,
			[ 'win7', 'chrome', '1280x960', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		assert.ok( !testCase.isValid() );
		assert.strictEqual( testCase.invalidReason, INVALID_REASON_BROWSER );
	});

	it('is not valid when operating system does not allow resolution', () => {
		const testCase = new TestCase(
			dimensions,
			[ 'macos', 'chrome', '800x600', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		assert.ok( !testCase.isValid() );
		assert.strictEqual( testCase.invalidReason, INVALID_REASON_RESOLUTION );
	});

	it('creates screenshot name', () => {

		const testCase = new TestCase(
			dimensions,
			[ 'win7', 'chrome', '1280x960', 'ctrl' ],
			'https://de.wikipedia.org'
		);

		assert.strictEqual( 'win7__chrome__1280x960__ctrl.png', testCase.getScreenshotFilename() );
	});
});
