import cartesian from './Cartesian';
import { TestCase } from "./TestCase";

export const BANNER = 'banner';
export const BROWSER = 'browser';
export const DEVICE = 'device';
export const OPERATING_SYSTEM = 'operating_system';
export const ORIENTATION = 'orientation';
export const RESOLUTION = 'resolution';

const ALLOWED_DIMENSIONS = [ BANNER, BROWSER, DEVICE, OPERATING_SYSTEM, ORIENTATION, RESOLUTION ];

export class TestCaseGenerator {
	testCases;
	dimensions;
	pageNames;
	pageNamePlaceholder;
	bannerUrl;

	constructor( pageNames, bannerUrl, pageNamePlaceholder ) {
		this.testCases = [];
		this.dimensions = new Map();

		this.pageNames = pageNames;
		this.bannerUrl = bannerUrl;
		this.pageNamePlaceholder = pageNamePlaceholder;
	}


	/**
	 *
	 * @param {string|number} key
	 * @param {[]} values
	 * @returns {TestCaseGenerator}
	 */
	addDimension( key, values ) {
		if( ALLOWED_DIMENSIONS.indexOf( key ) === -1 ) {
			throw new Error( `Invalid dimension: ${ key }` );
		}
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
	 * @param {[]} dimensionKeys
	 * @param {[]} dimensionValues
	 * @returns {void | string | *}
	 */
	getBannerUrl( dimensionKeys, dimensionValues ) {
		const index = dimensionKeys.indexOf( BANNER );
		return this.bannerUrl.replace( this.pageNamePlaceholder, this.pageNames.get( dimensionValues[ index ] ) );
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

		if( !this.dimensions.has( OPERATING_SYSTEM ) || !this.dimensions.has( BROWSER ) ) {
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