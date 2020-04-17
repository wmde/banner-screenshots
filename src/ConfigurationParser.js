import {BANNER as BANNER_DIMENSION} from "./Dimensions";

const toml = require( 'toml' );
import {TestCaseGenerator} from "./TestCaseGenerator";
import objectToMap from "./ObjectToMap";

const PREVIEW_URL = 'preview_url';
const BANNERS = 'banners';
const TEST_MATRIX = 'test_matrix';
const PAGE_NAME = 'pagename';
const PLACEHOLDER = '{{PLACEHOLDER}}';

export class ConfigurationParser {

	/**
	 * @param {string} data
	 */
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
	 * @return {TestCaseGenerator}
	 */
	generate( campaignName ) {
		if ( !this.data.has( campaignName ) ) {
			throw new Error( `Campaign "${campaignName}" not found in configuration!` );
		}
		const campaign = this.data.get( campaignName );

		this.validate( campaign );

		return this.createMatrix( campaign );
	}


	/**
	 * @param {Map<string,any>} campaign
	 * @return {TestCaseGenerator}
	 */
	createMatrix( campaign ) {

		const testMatrix = campaign.get( TEST_MATRIX );
		const banners = campaign.get( BANNERS );
		const previewUrl = campaign.get( PREVIEW_URL );

		testMatrix.set( BANNER_DIMENSION, Array.from( banners.keys() ) );

		const matrix = new TestCaseGenerator(
			this.getBannerPlaceholders( banners ),
			previewUrl,
			PLACEHOLDER
		);

		testMatrix.forEach( ( values, key ) => {
			matrix.addDimension( key, values );
		} );
		
		matrix.build();

		return matrix;
	}

	/**
	 * @param banners
	 * @return {Map<string, string>}
	 */
	getBannerPlaceholders( banners ) {
		let bannerMap = new Map();
		banners.forEach( (value, key) => {
			bannerMap.set( key, value.get( PAGE_NAME ) );
		} );
		return bannerMap;
	}
}