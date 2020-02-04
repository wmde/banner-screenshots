const { remote } = require('webdriverio');
const fs = require('fs');

(async () => {
	// TODO generate capabilities (borwser, resolution) from campaign_info.toml annd iterate
    const browser = await remote({
		// Uncomment for debugging
        // logLevel: 'trace',
        capabilities: {
            browserName: 'chrome'
        },
		path:'/'
    })
	
	// TODO Generate URL from campaign_info.toml and iterate banners
    await browser.url('https://de.wikipedia.org/wiki/Wikipedia:Hauptseite?banner=B19_WMDE_09_ctrl&uselang=en&force=1')
	// TODO generate filename from current iteration (browser, resolution, banner, OS)
	const filename = 'file.png';

	// TODO adapt banner selector to preact banners
	const banner = await browser.$('#WMDE_Banner');
	await banner.waitForExist(2000);
    await browser.waitUntil(
		async () => {
			const cssDisplay = await banner.getCSSProperty('display');
			const cssTop = await banner.getCSSProperty('top');
			return cssDisplay.value === 'block' && cssTop.value === '0px'
		},
		// We wait for 14 seconds because the browser animation might be slower than the 7 seconds it usually takes
		14000,
		'banner not displayed', 
		1000 
	);

	// TODO Wait until all in-banner animations (progress bar/highlight) have finished
	const shot = await browser.takeScreenshot();
	
	const buff = Buffer.from(shot, 'base64')
	fs.writeFile( filename, buff, err => {
		if (err) throw err;
		console.log('saved', filename)
	})
    await browser.deleteSession()
})().catch((e) => console.error(e))
