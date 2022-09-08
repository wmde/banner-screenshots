import { Dimension } from "./Model/Dimension";

import { parse as parseTOML} from 'toml';
import {TestCaseGenerator} from "./Model/TestCaseGenerator";
import objectToMap from "./ObjectToMap";

// Campaign keys
const PREVIEW_URL = 'preview_url';
const BANNERS = 'banners';
const TEST_MATRIX = 'test_matrix';
const CAMPAIGN_TRACKING = 'campaign_tracking';

// Banner keys
const PAGE_NAME = 'pagename';

// Placeholder in PREVIEW_URL
const PLACEHOLDER = '{{PLACEHOLDER}}';


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

		testMatrix.set( Dimension.BANNER, Array.from( banners.keys() ) );

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
