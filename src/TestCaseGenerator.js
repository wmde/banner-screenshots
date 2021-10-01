import cartesian from './Cartesian.js';
import {TestCase} from "./TestCase.js";
import {ALLOWED_DIMENSIONS, BANNER, DEVICE, PLATFORM} from "./Dimensions.js";

export class TestCaseGenerator {
	testCases;
	dimensions;
	pageNames;
	pageNamePlaceholder;
	bannerUrl;

	/**
	 * @param {Map<string,string>} pageNames map short banner names (ctrl, var) to CentralNotice banner names
	 * @param {string} bannerUrl Url that can contain a placeholder
	 * @param {string} pageNamePlaceholder Placeholder string for banner names
	 */
	constructor( pageNames, bannerUrl, pageNamePlaceholder ) {
		this.testCases = [];
		this.dimensions = new Map();

		this.pageNames = pageNames;
		this.bannerUrl = bannerUrl;
		this.pageNamePlaceholder = pageNamePlaceholder;
	}


	/**
	 *
	 * @param {string} key
	 * @param {string[]} values
	 * @returns {TestCaseGenerator}
	 */
	addDimension( key, values ) {
		if( ALLOWED_DIMENSIONS.indexOf( key ) === -1 ) {
			throw new Error( `Invalid dimension: ${ key }` );
		}
		// TODO validate platform keys (list of available resolutions, browser and OS)
		this.dimensions.set( key, values );
		return this;
	}


	build() {
		this.validate();

		const matrix = cartesian.apply( this, Array.from( this.dimensions.values() ) );
		const dimensionKeys = Array.from( this.dimensions.keys() );

		matrix.forEach( dimensionValues => {
			this.testCases.push(
				new TestCase( dimensionKeys, dimensionValues, this.getBannerUrl( dimensionKeys, dimensionValues ) )
			);
		} );
	}


	/**
	 *
	 * @param {string[]} dimensionKeys
	 * @param {string[]} dimensionValues
	 * @returns {string}
	 */
	getBannerUrl( dimensionKeys, dimensionValues ) {
		const bannerIndex = dimensionKeys.indexOf( BANNER );
		return this.bannerUrl.replace( this.pageNamePlaceholder, this.pageNames.get( dimensionValues[ bannerIndex ] ) );
	}


	/**
	 * @returns void
	 */
	validate() {
		this.validateRequired();
		this.validateDimensions();
	}


	/**
	 * @returns void
	 */
	validateRequired() {
		if( typeof this.pageNames === "undefined" ||
			typeof this.pageNamePlaceholder === "undefined" ||
			typeof this.bannerUrl === "undefined" ) {
			throw new Error( 'You must supply banner url information before building' );
		}
	}


	/**
	 * @returns void
	 */
	validateDimensions() {
		if( this.dimensions.has( DEVICE ) ) {
			return;
		}

		if( !this.dimensions.has( PLATFORM ) ) {
			throw new Error( 'Dimensions are missing a required column, please specify a device name or a combination of browser and OS' );
		}
	}

	
	/**
	 * @returns {TestCase[]}
	 */
	getTestCases() {
		return this.testCases;
	}


	/**
	 * @returns {TestCase[]}
	 */
	getValidTestCases() {
		return this.testCases.filter( testCase => testCase.isValid() );
	}

}
