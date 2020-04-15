const toml = require( 'toml' );
import {TestMatrix, BANNER as BANNER_DIMENSION} from "./TestMatrix";
import objectToMap from "./ObjectToMap";

const PREVIEW_URL = 'preview_url';
const BANNERS = 'banners';
const TEST_MATRIX = 'test_matrix';
const PAGE_NAME = 'pagename';
const PLACEHOLDER = '{{PLACEHOLDER}}';

export class ConfigurationParser {

	constructor( data ) {
		const tomlData = toml.parse( data );
		this.data = objectToMap( tomlData );
	}


	/**
	 * @param {Map<string,any>} campaign
	 */
	validate( campaign ) {
		if( !campaign.has( PREVIEW_URL ) ) {
			throw new Error( `${PREVIEW_URL} configuration item is required` );
		}

		if( !campaign.has( BANNERS ) ) {
			throw new Error( `${BANNERS} configuration item is required` );
		}

		if( !campaign.has( TEST_MATRIX ) ) {
			throw new Error( `${TEST_MATRIX} configuration item is required` );
		}
	}


	/**
	 * @param {string} campaignName
	 * @return {TestMatrix}
	 */
	generate( campaignName ) {
		const campaign = this.data.get( campaignName );

		this.validate( campaign );

		const testMatrix = campaign.get( TEST_MATRIX );
		testMatrix.set( BANNER_DIMENSION, Array.from( campaign.get( BANNERS ).keys() ) );

		return this.createMatrix( testMatrix );
	}


	/**
	 * @param {string} campaignName
	 * @return {Map<string, string>}
	 */
	getBannerUrls( campaignName ) {
		const campaign = this.data.get( campaignName );
		const banners = campaign.get( BANNERS );
		const previewUrl = campaign.get( PREVIEW_URL );

		const bannerUrls = new Map();
		banners.forEach( ( banner, key ) => {
			bannerUrls.set( key, previewUrl.replace( PLACEHOLDER , banner.get( PAGE_NAME ) ) );
		} );
		return bannerUrls;
	}

	/**
	 * @param {Map<string,string[]>} dimensions
	 * @return {TestMatrix}
	 */
	createMatrix( dimensions ) {
		const matrix = new TestMatrix();

		dimensions.forEach( ( values, key ) => {
			matrix.addDimension( key, values );
		} );

		matrix.build();

		return matrix;
	}
}