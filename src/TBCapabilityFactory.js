import {DEVICE, PLATFORM, ORIENTATION, RESOLUTION} from "./Dimensions";

const DEVICE_NAMES = new Map( [
	[ 'iphone_xs_max', { browserName : 'safari', platform : 'iOS', browserVersion : '12.1', platformName : 'iOS', deviceName : 'iPhone XS Max' } ],
	[ 'iphone_5s', { browserName : 'safari', platform : 'iOS', browserVersion : '12.1', platformName : 'iOS', deviceName : 'iPhone 5s' } ],
	[ 'samsung_s6', {browserName : 'browser',platform : 'Android', browserVersion : '6.0',platformName : 'Android', deviceName : 'Galaxy S6'} ],
	[ 'samsung_s9_plus', { browserName : 'Chrome',platform : 'Android', browserVersion : '9.0',platformName : 'Android', deviceName : 'Galaxy S9'} ],
]);

const PLATFORM_NAMES = new Map( [
	[ 'ie11', 			{ platformName: 'WIN7', browserName: 'internet explorer', browserVersion: 11 } ],
	[ 'edge', 			{ platformName: 'WIN10', browserName: 'microsoftedge', browserVersion: 91 } ],
	[ 'firefox_win10', 	{ platformName: 'WIN10', browserName: 'firefox', browserVersion: 89 } ],
	[ 'chrome_win10', 	{ platformName: 'WIN10', browserName: 'chrome', browserVersion: 91 } ],

	[ 'firefox_linux', { platformName: 'LINUX', browserName: 'firefox', browserVersion: 89 } ],
	[ 'chrome_linux', { platformName: 'LINUX', browserName: 'chrome', browserVersion: 91 } ],

	/* macos 10.15 */
	[ 'chrome_macos', { platformName: 'CATALINA', browserName: 'chrome', browserVersion: 91 } ],
	[ 'firefox_macos', { platformName: 'CATALINA', browserName: 'firefox', browserVersion: 89 } ],
	[ 'safari', { platformName: 'CATALINA', browserName: 'safari', browserVersion: 13 } ],
]);

//https://tracking.wikimedia.de/index.php?module=CoreHome&action=index&idSite=1&period=day&date=today&updated=2#?idSite=1&period=range&date=2020-11-04,2020-12-16&segment=&category=General_Visitors&subcategory=DevicesDetection_Software
//TOP 50 browser configs (grouped)
/*

Windows / Chrome / 1280x(720-1024)
Windows / Chrome / 1366x(768-854)
Windows / Chrome / 1600x900
Windows / Chrome / 1680x1050
Windows / Chrome / 1920x(1080-1200)
Windows / Microsoft Edge / 1280x720
Windows / Microsoft Edge / 1366x768
Windows / Microsoft Edge / 1536x864
Windows / Microsoft Edge / 1600x900
Windows / Microsoft Edge / 1680x1050
Windows / Microsoft Edge / 1920x1080
Windows / Firefox / 1280x720
Windows / Firefox / 1366x768
Windows / Firefox / 1536x864
Windows / Firefox / 1600x900
Windows / Firefox / 1680x1050
Windows / Firefox / 1920x(1080-1200)
Windows / Firefox / 2560x1440
Mac / Safari / 768x1024
Mac / Safari / 810x1080
Mac / Safari / 834x1112
Mac / Safari / 1024x1366
Mac / Safari / 1280x800
Mac / Safari / 1440x900
Mac / Safari / 1920x1080
Mac / Safari / 2560x1440



iOS / Mobile Safari / 320x568
iOS / Mobile Safari / 375x667
iOS / Mobile Safari / 414x(736-896)
iOS / Mobile Safari / 768x1024

Android / Chrome Mobile / 360x(640-740)
Android / Chrome Mobile / 412x(869-915)
Android / Samsung Browser / 360x(640-740)
Android / Samsung Browser / 412x915
 */


// ==========================================================================================================================0
//recommended set of screen resolutions to test desktop (platform+browser): (supported by testingbot appearantly, also matches our users' most used devices)
/*
e.g. resolution: "1280x1024",
800x600
1024x768
1280x960
1600x1200
1920x1200
(2560x1440)<- should be tested as well maybe, a lot of people use it
 */




//particular mobile devices that fit the iOS resolutions:-----------------------------------------------------
/*
320x568   4" iPhone SE
375x667   iPhone 8,7,6;
	 	375x812		iPhone 12 mini, iPhone 11 Pro, iPhone XS
414x736	  iPhone 8,7,6 Plus
		414x896		iPhone 11 Pro Max, iPhone 11, iPhone XS Max
768x1024  9.7" iPad Pro, 7.9" iPad mini, 9.7" iPad Air, 9.7" iPad
 */
//TODO: portrait mode/ landscape mode
//"orientation" : "LANDSCAPE " / "PORTRAIT"
/*
[ 'iphone_xs_max', { browserName : 'safari', platform : 'iOS', browserVersion : '12.1', platformName : 'iOS', deviceName : 'iPhone XS Max' } ],
[ 'iphone_5s', { browserName : 'safari', platform : 'iOS', browserVersion : '12.1', platformName : 'iOS', deviceName : 'iPhone 5s' } ],

[ 'iphone_se', { browserName : 'safari', platform : 'iOS', browserVersion : '11.4', platformName : 'iOS', deviceName : 'iPhone SE' } ],
[ 'iphone_8', { browserName : 'safari', platform : 'iOS', browserVersion : '14.0', platformName : 'iOS', deviceName : 'iPhone 8' } ],
[ 'iphone_12_mini', { browserName : 'safari', platform : 'iOS', browserVersion : '14.2', platformName : 'iOS', deviceName : 'iPhone 12 mini' } ],
[ 'iphone_7_plus', { browserName : 'safari', platform : 'iOS', browserVersion : '11.4', platformName : 'iOS', deviceName : 'iPhone 7 Plus' } ],
[ 'iphone_11_pro_max', { browserName : 'safari', platform : 'iOS', browserVersion : '13.4', platformName : 'iOS', deviceName : 'iPhone 11 Pro Max' } ],
[ 'ipad_pro_9_7_inch', { browserName : 'safari', platform : 'iOS', browserVersion : '14.2', platformName : 'iOS', deviceName : 'iPad Pro (9.7-inch)' } ],
 */


//particular mobile devices that fit the android resolutions and are available on testingbot:--------------------------------------------------
//https://viewportsizer.com/devices/
//https://api.testingbot.com/v1/browsers
/*
360x(640-740)	Samsung Galaxy S6, Samsung Galaxy S9, Samsung Galaxy S10
412x(869-915)	Google Pixel 4, Nexus 6
 */
/*
[ 'samsung_s6', {browserName : 'browser',platform : 'Android', browserVersion : '6.0',platformName : 'Android', deviceName : 'Galaxy S6'} ],
[ 'samsung_s10_chrome', { browserName : 'Chrome',platform : 'Android', browserVersion : '10.0',platformName : 'Android', deviceName : 'Galaxy S10'} ],
[ 'samsung_s10_firefox', { browserName : 'firefox',platform : 'Android', browserVersion : '10.0',platformName : 'Android', deviceName : 'Galaxy S10'} ],
[ 'nexus_6', { browserName : 'browser',platform : 'Android', browserVersion : '6.0',platformName : 'Android', deviceName : 'Nexus 6'} ],
 */







export class CapabilityFactory {
	/**
	 *
	 * @param {object} defaultCapabilities
	 */
	constructor( defaultCapabilities ) {
		this.defaultCapabilities = defaultCapabilities;
	}

	/**
	 *
	 * @param {TestCase} testCase
	 * @return object
	 */
	getCapabilities( testCase ) {
		const dimensions = testCase.getDimensions();

		// TODO use deep clone library instead
		let capabilityResult = Object.assign( {}, this.defaultCapabilities ) ;

		if ( dimensions.has( DEVICE ) ) {
			const device = dimensions.get( DEVICE );
			if ( !DEVICE_NAMES.has( device ) ) {
				throw new Error( `Unsupported device: ${device}` )
			}
			capabilityResult = DEVICE_NAMES.get( device );
			capabilityResult.deviceOrientation = dimensions.has( ORIENTATION ) ? dimensions.get( ORIENTATION ) : 'portrait';
			return capabilityResult;
		}
		else {
			const platform = dimensions.get( PLATFORM );
			if ( !PLATFORM_NAMES.has( platform ) ) {
				throw new Error( `Unsupported platform: ${platform}` )
			}
			capabilityResult = Object.assign( {}, capabilityResult, PLATFORM_NAMES.get( platform ) );
		}
		
		if ( dimensions.has( RESOLUTION ) ) {
			capabilityResult['tb:options']['screen-resolution'] = dimensions.get( RESOLUTION );
		}

		return capabilityResult;
	}

}
