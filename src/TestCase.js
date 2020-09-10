import { DEVICE, PLATFORM, RESOLUTION} from "./Dimensions";

const PLATFORM_EXCLUDED_RESOLUTIONS = [
	{
		name: 'firefox_macos',
		excluded: [ '800x600' ]
	},
	{
		name: 'chrome_macos',
		excluded: [ '800x600' ]
	}
];

export const INVALID_REASON_REQUIRED = 'The required dimensions are missing';
export const INVALID_REASON_RESOLUTION = 'This resolution is not available on this platform';

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
		return this.dimensions.has( PLATFORM );
	}

	/**
	 *
	 * @returns {boolean}
	 */
	validateResolution() {
		const resolution = this.dimensions.get( RESOLUTION );
		if( resolution === undefined ) return true;

		const platform = this.dimensions.get( PLATFORM );


		let valid = true;
		PLATFORM_EXCLUDED_RESOLUTIONS.forEach( currentPlatform => {
			if( platform !== currentPlatform.name ) {
				return;
			}

			if( currentPlatform.excluded.indexOf( resolution ) > -1 ) {
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