import {BROWSER, DEVICE, OPERATING_SYSTEM, RESOLUTION} from "./Dimensions";

const BROWSERS_EXCLUDED_OPERATING_SYSTEMS = [
	{
		name: 'ie11',
		excluded: [ 'win10', 'linux', 'macos' ]
	},
	{
		name: 'edge',
		excluded: [ 'win7', 'linux', 'macos' ]
	},
	{
		name: 'safari',
		excluded: [ 'win7', 'win10', 'linux' ]
	},
	{
		name: 'chrome',
		excluded: [ 'win7' ]
	},
	{
		name: 'firefox',
		excluded: [ 'win7' ]
	}
];

const OPERATING_SYSTEMS_EXCLUDED_RESOLUTIONS = [
	{
		name: 'macos',
		excluded: [ '800x600' ]
	}
];

export const INVALID_REASON_REQUIRED = 'The required dimensions are missing';
export const INVALID_REASON_BROWSER = 'This operating system is not compatible with browser';
export const INVALID_REASON_RESOLUTION = 'This resolution is not compatible with operating system';

export class TestCase {
	valid;
	invalidReason;
	dimensions;
	bannerUrl;
	screenshotFilename;


	/**
	 *
	 * @param {[]} dimensionKeys
	 * @param {[]} dimensionValues
	 * @param {string} bannerUrl
	 */
	constructor( dimensionKeys, dimensionValues, bannerUrl ) {
		this.dimensions = new Map( dimensionValues.map( ( v, i ) => [ dimensionKeys[ i ], v ] ) );
		this.bannerUrl = bannerUrl;
		this.screenshotFilename = dimensionValues.join('__') + '.png';

		this.validate();
	}


	/**
	 * @return {void}
	 */
	validate() {
		this.valid = true;
		this.invalidReason = '';

		if( !this.validateRequiredDimensions() ) {
			this.valid = false;
			this.invalidReason = INVALID_REASON_REQUIRED;
			return;
		}

		if( !this.validateBrowser() ) {
			this.valid = false;
			this.invalidReason = INVALID_REASON_BROWSER;
			return;
		}

		if( !this.validateResolution() ) {
			this.valid = false;
			this.invalidReason = INVALID_REASON_RESOLUTION;
		}
	}


	/**
	 * @returns {boolean}
	 */
	validateRequiredDimensions() {
		if( this.dimensions.has( DEVICE ) ) return true;
		return this.dimensions.has( BROWSER ) && this.dimensions.has( OPERATING_SYSTEM );
	}


	/**
	 * @returns {boolean}
	 */
	validateBrowser() {
		const browser = this.dimensions.get( BROWSER );
		const os = this.dimensions.get( OPERATING_SYSTEM );

		let valid = true;
		BROWSERS_EXCLUDED_OPERATING_SYSTEMS.forEach( currentBrowser => {
			if( browser !== currentBrowser.name ) {
				return;
			}

			if( currentBrowser.excluded.indexOf( os ) > -1 ) {
				valid = false;
			}
		} );

		return valid;
	}


	/**
	 *
	 * @returns {boolean}
	 */
	validateResolution() {
		const resolution = this.dimensions.get( RESOLUTION );
		if( resolution === undefined ) return true;

		const os = this.dimensions.get( OPERATING_SYSTEM );


		let valid = true;
		OPERATING_SYSTEMS_EXCLUDED_RESOLUTIONS.forEach( currentOs => {
			if( os !== currentOs.name ) {
				return;
			}

			if( currentOs.excluded.indexOf( resolution ) > -1 ) {
				valid = false;
			}
		} );

		return valid;
	}


	/**
	 * @returns {boolean}
	 */
	isValid() {
		return this.valid;
	}


	/**
	 * @returns {string}
	 */
	getBannerUrl() {
		return this.bannerUrl;
	}


	/**
	 * @returns {string}
	 */
	getScreenshotFilename() {
		return this.screenshotFilename;
	}


	/**
	 * @returns {Map}
	 */
	getDimensions() {
		return this.dimensions;
	}
}