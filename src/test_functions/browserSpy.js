import {writeImageData} from "../writeImageData";

export async function browserSpy( browser, testCase ) {
	await browser.url(testCase.getBannerUrl());

	const filename = testCase.getScreenshotFilename();
	const shot = await browser.takeScreenshot();
	await writeImageData( shot, filename );

	await browser.deleteSession()
}