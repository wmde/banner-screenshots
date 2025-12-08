import { Dimension } from "./Model/Dimension";

import { parse as parseTOML} from 'toml';
import {TestCaseGenerator} from "./Model/TestCaseGenerator";
import objectToMap from "./ObjectToMap";
import { PreviewUrl } from './Model/PreviewUrl';

// Campaign keys
const PREVIEW_URL = 'preview_url';
const PREVIEW_URL_DARKMODE = 'preview_url_darkmode';
const BANNERS = 'banners';
const TEST_MATRIX = 'test_matrix';
const CAMPAIGN_TRACKING = 'campaign_tracking';

// Banner keys
const PAGE_NAME = 'pagename';

// Placeholder in PREVIEW_URL
const PLACEHOLDER = '{{banner}}';


/**
 * Create a test case builder (TestCaseGenerator) from a campaign TOML file
 *
 * @todo The pattern of converting the raw JavaScript object that comes
 * from parsing TOML to a Map containing `any` values should be replaced
 * with a proper deserialization/initialization library.
 */
export class ConfigurationParser {

	data: Map<string,any>;

	constructor( data: string ) {
		const tomlData = parseTOML( data );
		this.data = objectToMap( tomlData );
	}


	validate( campaign: Map<string,any> ) {
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


	generate( campaignName: string ): TestCaseGenerator {
		this.checkForCampaignName( campaignName );
		const campaign = this.data.get( campaignName );

		this.validate( campaign );

		return this.createMatrix( campaign );
	}

	private checkForCampaignName( campaignName: string ): void {
		if ( !this.data.has( campaignName ) ) {
			throw new Error( `Campaign "${campaignName}" not found in configuration!` );
		}
	}

	private createMatrix( campaign: Map<string, any> ): TestCaseGenerator {

		const testMatrix = campaign.get( TEST_MATRIX );
		const banners = campaign.get( BANNERS );
		const previewUrl = campaign.get( PREVIEW_URL );
		const previewUrlDarkmode = campaign.get( PREVIEW_URL_DARKMODE );

		const previewUrlObject = new PreviewUrl( previewUrl, previewUrlDarkmode );

		// If preview_url_darkmode is not defined, the PreviewUrl class object will have only one property (preview_url_darkmode has to be optional in the class then)

		// create an object of PreviewUrl class with preview_url and/or preview_url_darkmode

		// If preview_url_darkmode is defined: add a new dimension to the test matrix (Dimension.DARK_MODE)
		// It has two values: "on" and "off" ()

		testMatrix.set( Dimension.BANNER, Array.from( banners.keys() ) );

		if ( previewUrlObject.previewUrlDarkmode !== undefined ) {
			testMatrix.set( Dimension.DARKMODE, [ 'on', 'off' ] );
		}

		const matrix = new TestCaseGenerator(
			this.getBannerPlaceholders( banners ),
			previewUrlObject,
			PLACEHOLDER
		);

		testMatrix.forEach( ( values, key ) => {
			matrix.addDimension( key, values );
		} );

		matrix.build();

		return matrix;
	}

	private getBannerPlaceholders( banners: Map<string, Map<string, string>> ): Map<string, string> {
		let bannerMap = new Map();
		banners.forEach( (value, key) => {
			bannerMap.set( key, value.get( PAGE_NAME ) );
		} );
		return bannerMap;
	}

	getCampaignTracking( campaignName: string ): string {
		this.checkForCampaignName( campaignName );
		return this.data.get( campaignName ).get( CAMPAIGN_TRACKING )
	}

}
