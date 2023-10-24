import { Dimension } from "../Model/Dimension";
import {TestCaseFinishedState, TestCaseIsRunningState} from "../Model/TestCase";

/**
 *
 * @param browser - WebdriverIO browser instance
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
	onStateChange(testCase, new TestCaseIsRunningState( `URL requested - ${testCase.getBannerUrl()}` ) );

	const banner = await browser.$('.wmde-banner');
	onStateChange(testCase, new TestCaseIsRunningState( "Banner root element requested" ) );

	await banner.waitForExist( {
		// wait for max 5 seoncds for the page to load and CentralNotice to load the banner code
		timeout: 5000,
		timeoutMsg: `Page did not contain class "wmde-banner" for banner ${testCase.getScreenshotFilename()}`
	} );
	onStateChange(testCase, new TestCaseIsRunningState( "Banner root element found" ) );

	let bannerStateClass = '';
	await banner.waitUntil( async () => {
		const classes = await banner.getAttribute( "class" );
		const expectedStateMatch = classes.match( /wmde-banner--(not-shown|visible)/ );
		if ( expectedStateMatch === null ) {
			return false;
		}
		bannerStateClass = expectedStateMatch[1];
		return true;
	}, {
		// 15 seconds should be more than sufficient to wait both for the initial delay and the animation
		timeout: 15000,
		timeoutMsg: `Banner did not reach state "visible" or "not-shown" for banner ${testCase.getScreenshotFilename()}`
	} );

	if ( bannerStateClass === 'not-shown' ) {
		onStateChange(testCase, new TestCaseFinishedState( "Banner has size issues" ) );
		return;
	}

	onStateChange(testCase, new TestCaseIsRunningState( "Banner is visible" ) );


	// TODO Wait until all in-banner animations (progress bar/highlight) have finished
	const shot = await browser.takeScreenshot();
	onStateChange(testCase, new TestCaseIsRunningState( "Got screenshot from service" ) );

	await writeImageData( shot, testCase.getScreenshotFilename() );
	onStateChange(testCase, new TestCaseIsRunningState( "Wrote screenshot to disk" ) );

	await browser.deleteSession()
	onStateChange(testCase, new TestCaseFinishedState( "Successfully took a screenshot" ) );
}
