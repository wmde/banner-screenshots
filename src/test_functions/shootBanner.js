import {writeImageData} from "../writeImageData";

export async function shootBanner( browser ) {
	// TODO Generate URL from 2nd parameter
	await browser.url('https://de.wikipedia.org/wiki/Wikipedia:Hauptseite?banner=B19_WMDE_09_ctrl&uselang=en&force=1')
	// TODO generate filename from current iteration (browser, resolution, banner, OS) (2nd parameter)
	const filename = 'file.png';

	// TODO adapt banner selector to preact banners
	const banner = await browser.$('#WMDE_Banner');
	await banner.waitForExist(2000);
	await browser.waitUntil(
		async () => {
			const cssDisplay = await banner.getCSSProperty('display');
			const cssTop = await banner.getCSSProperty('top');
			return cssDisplay[0].value === 'block' && cssTop[0].value === '0px'
		},
		// We wait for 14 seconds because the browser animation might be slower than the 7 seconds it usually takes
		14000,
		'banner not displayed',
		1000
	);

	// TODO Wait until all in-banner animations (progress bar/highlight) have finished
	const shot = await browser.takeScreenshot();
	await writeImageData( shot, filename );


	await browser.deleteSession()
}