export class TestCaseSerializer {
	/**
	 *
	 * @param {TestCase[]} testcases
	 * @returns {*}
	 */
	serializeTestCases( testcases ) {
		return testcases.map( testCase => ({
			valid: testCase.isValid(),
			invalidReason: testCase.invalidReason,
			dimensions: testCase.getDimensions(),
			bannerUrl: testCase.getBannerUrl(),
			screenshotFilename: testCase.getScreenshotFilename(),
			message: testCase.state.finished ? "" : testCase.state.description
		}) );
	}
}
