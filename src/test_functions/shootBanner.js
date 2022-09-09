import { Dimension } from "../Model/Dimension";
import {TestCaseFinishedState, TestCaseIsRunningState} from "../Model/TestCase";

/**
 *
 * @param browser
 * @param {TestCase} testCase
 * @param {function} writeImageData - A callback that writes image data
 * @param {function} onStateChange - A callback that updates the test case state (and maybe logs)
 * @return {Promise<void>}
 */
export async function shootBanner( browser, testCase, writeImageData, onStateChange ) {
	onStateChange(testCase, new TestCaseIsRunningState( "Testcase started" ) );

	if (testCase.dimensions.has( Dimension.RESOLUTION )) {
		const [width, height] = testCase.dimensions.get( Dimension.RESOLUTION ).split( "x", 2 );
		await browser.setWindowSize(Number(width), Number(height));
	}

	await browser.url( testCase.getBannerUrl() )
	onStateChange(testCase, new TestCaseIsRunningState( "URL requested" ) );

	const banner = await browser.$('.banner-position--state-finished');
	onStateChange(testCase, new TestCaseIsRunningState( "Banner display finish element requested" ) );

	// TODO find a less time-intensive and error-prone way to check for banners
	//      that don't display due to banner size issues
	await banner.waitForExist( {
		timeout: 30000,
		timeoutMsg: `Page did not contain class "banner-position--state-finished" for banner ${testCase.getScreenshotFilename()}, probably a size issue`
	} );
	onStateChange(testCase, new TestCaseIsRunningState( "Banner display finish element found" ) );

	// TODO Wait until all in-banner animations (progress bar/highlight) have finished
	const shot = await browser.takeScreenshot();
	onStateChange(testCase, new TestCaseIsRunningState( "Got screenshot from service" ) );

	await writeImageData( shot, testCase.getScreenshotFilename() );
	onStateChange(testCase, new TestCaseIsRunningState( "Wrote screenshot to disk" ) );

	await browser.deleteSession()
	onStateChange(testCase, new TestCaseFinishedState( "Successfully took a screenshot" ) );
}
