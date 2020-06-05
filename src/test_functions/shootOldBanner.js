/**
 *
 * @param browser
 * @param {TestCase} testCase
 * @param {function} writeImageData
 * @return {Promise<void>}
 */
export async function shootBanner( browser, testCase, writeImageData ) {
	await browser.url( testCase.getBannerUrl() )

	await browser.pause(30000)
	// TODO Wait until all in-banner animations (progress bar/highlight) have finished
	const shot = await browser.takeScreenshot();
	await writeImageData( shot, testCase.getScreenshotFilename() );

	await browser.deleteSession()
}
