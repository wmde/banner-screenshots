import { DEVICE, PLATFORM, RESOLUTION} from "./Dimensions.js";

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

abstract class TestCaseState {
	finished: boolean;
	description: string;

	constructor() {
		this.finished = false;
	}
}

export class TestCasePendingState extends TestCaseState {

	constructor() {
		super();
		this.description = "Test case is pending"
	}
}

export class TestCaseFinishedState extends TestCaseState {
	constructor( description: string ) {
		super()
		this.finished = true;
		this.description = description
	}
}

export class TestCaseIsRunningState extends TestCaseState {
	constructor( description: string ) {
		super();
		this.finished = false;
		this.description = description;
	}
}

export class TestCaseFailedState extends TestCaseState {
	error?: Error;

	constructor( description: string, error?: Error ) {
		super();
		this.description = description;
		this.error = error;
	}
}

export class TestCase {
	valid: boolean;
	invalidReason: string;
	dimensions: Map<string,string>;
	bannerUrl: string;
	name: string;
	state: TestCaseState;

	constructor( dimensionKeys: string[], dimensionValues: string[], bannerUrl: string ) {
		this.dimensions = new Map( dimensionValues.map( ( v, i ) => [ dimensionKeys[ i ], v ] ) );
		this.bannerUrl = bannerUrl;
		this.name = dimensionValues.join('__');
		this.state = new TestCasePendingState();

		this.validate();
	}


	// TODO Since this is platform-specific the validation and changing of the state should be moved to a different interface
	private validate(): void {
		this.valid = true;
		this.invalidReason = '';

		if( !this.validateRequiredDimensions() ) {
			this.valid = false;
			this.invalidReason = INVALID_REASON_REQUIRED;
			this.updateState( new TestCaseFailedState( INVALID_REASON_REQUIRED, null ) );
			return;
		}

		if( !this.validateResolution() ) {
			this.valid = false;
			this.invalidReason = INVALID_REASON_RESOLUTION;
			this.updateState( new TestCaseFailedState( INVALID_REASON_RESOLUTION, null ) );
		}
	}


	validateRequiredDimensions(): boolean {
		if( this.dimensions.has( DEVICE ) ) return true;
		return this.dimensions.has( PLATFORM );
	}

	validateResolution(): boolean {
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


	isValid(): boolean {
		return this.valid;
	}


	getBannerUrl(): string {
		return this.bannerUrl;
	}

	getName(): string {
		return this.name;
	}

	getScreenshotFilename(): string {
		return this.name  + '.png';
	}


	getDimensions(): Map<string, string> {
		return this.dimensions;
	}

	updateState( state: TestCaseState ) {
		this.state = state;
	}
}