import {writeImageData} from "../writeImageData";

export async function browserSpy( browser ) {
	await browser.url('https://browserspy.dk/browser.php')
	const filename = `${browser.capabilities.browserName}__${browser.capabilities.platform}__${browser.sessionId}.png`.replace(' ','-').toLowerCase();

	const shot = await browser.takeScreenshot();
	await writeImageData( shot, filename );

	await browser.deleteSession()
}