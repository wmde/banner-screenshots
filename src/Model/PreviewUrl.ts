

export class PreviewUrl {
	public readonly previewUrl: string;
	public readonly previewUrlDarkmode?: string;

	constructor( previewUrl: string, previewUrlDarkmode?: string ) {
		this.previewUrl = previewUrl;

		if ( previewUrlDarkmode !== undefined ) {
			this.previewUrlDarkmode = previewUrlDarkmode;
		}
	}
}