/**
 *
 * @param browser
 * @param {TestCase} testCase
 * @param {function} writeImageData
 * @return {Promise<void>}
 */
export async function shootBanner( browser, testCase, writeImageData ) {
	await browser.url( testCase.getBannerUrl() )

	const banner = await browser.$('.banner-position--state-finished');
	await banner.waitForExist( {
		timeout: 30000,
		timeoutMsg: `Page did not contain class "banner-position--state-finished" for banner ${testCase.getScreenshotFilename()}`
	} );

	// TODO Wait until all in-banner animations (progress bar/highlight) have finished
	const shot = await browser.takeScreenshot();
	await writeImageData( shot, testCase.getScreenshotFilename() );

	await browser.deleteSession()
}