/**
 * This function checks a branch or tag name like C21_WMDE_Test_07 and
 * returns a channel name for the campaign_info.toml file.
 */
export function determineCampaignFromBranchName( branchName: string ): string {
	const campaignParts = new Map( branchName.
								  toLowerCase().
								  split("_").
								  map( part => [ part, true ] )
								 );
	if ( !campaignParts.has('wmde') && !campaignParts.has('wpde') ) {
		throw new Error('Name does not contain WPDE or WMDE');
	}

	if ( campaignParts.has('wpde') ) {
		if ( Array.from( campaignParts.keys() ).find( k => /mob/.test(k) ) ) {
			return 'wpde_mobile';
		}
		return 'wpde_desktop';
	}

	if ( campaignParts.has('mobile') ) {
		return campaignParts.has('en') ? 'mobile_english' : 'mobile';
	}

	if ( campaignParts.has('ipad') || campaignParts.has('pad') ) {
		return campaignParts.has('en') ? 'pad_en' : 'pad';
	}


	return campaignParts.has('en') ? 'english' : 'desktop';
}
