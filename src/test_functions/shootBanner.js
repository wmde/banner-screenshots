import { RESOLUTION } from "../Dimensions.js";
import {TestCaseFinishedState, TestCaseIsRunningState} from "../TestCase";

/**
 *
 * @param browser
 * @param {TestCase} testCase
 * @param {function} writeImageData
 * @return {Promise<void>}
 */
export async function shootBanner( browser, testCase, writeImageData ) {
	testCase.updateState( new TestCaseIsRunningState( "Testcase started" ) );

	if (testCase.dimensions.has(RESOLUTION)) {
		const [width, height] = testCase.dimensions.get(RESOLUTION).split("x", 2);
		await browser.setWindowSize(Number(width), Number(height));
	}

	await browser.url( testCase.getBannerUrl() )
	testCase.updateState( new TestCaseIsRunningState( "URL requested" ) );

	const banner = await browser.$('.banner-position--state-finished');
	testCase.updateState( new TestCaseIsRunningState( "Banner display finish element requested" ) );

	await banner.waitForExist( {
		timeout: 30000,
		timeoutMsg: `Page did not contain class "banner-position--state-finished" for banner ${testCase.getScreenshotFilename()}, probably a size issue`
	} );
	testCase.updateState( new TestCaseIsRunningState( "Banner display finish element found" ) );

	// TODO Wait until all in-banner animations (progress bar/highlight) have finished
	const shot = await browser.takeScreenshot();
	testCase.updateState( new TestCaseIsRunningState( "Got screenshot from service" ) );

	await writeImageData( shot, testCase.getScreenshotFilename() );
	testCase.updateState( new TestCaseIsRunningState( "Wrote screenshot to disk" ) );

	await browser.deleteSession()
	testCase.updateState( new TestCaseFinishedState( "Successfully took a screenshot" ) );
}
