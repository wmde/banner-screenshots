import { Dimension } from "./Dimension";

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
	stateName = "pending" as const;

	constructor() {
		super();
		this.description = "Test case is pending"
	}
}

export class TestCaseFinishedState extends TestCaseState {
	stateName = "finished" as const;

	constructor( description: string ) {
		super()
		this.finished = true;
		this.description = description
	}
}

export class TestCaseIsRunningState extends TestCaseState {
	stateName = "running" as const;

	constructor( description: string ) {
		super();
		this.finished = false;
		this.description = description;
	}
}

export class TestCaseFailedState extends TestCaseState {
	stateName =  "failed" as const;
	error?: Error;

	constructor( description: string, error?: Error ) {
		super();
		this.description = description;
		this.error = error;
	}
}

export class TestCase {
	private dimensions: Map<string,string>;
	private bannerUrl: string;
	private name: string;
	private state: TestCaseState;

	private constructor() {
	}

	public static create( dimensionKeys: Dimension[], dimensionValues: string[], bannerUrl: string ): TestCase {
		const testCase = new TestCase();
		if (dimensionKeys.length !== dimensionValues.length ) {
			throw new Error( 'You must provide the same number of dimension keys and values' );
		}
		testCase.dimensions = new Map( dimensionValues.map( ( v, i ) => [ dimensionKeys[ i ], v ] ) );
		testCase.bannerUrl = bannerUrl;
		testCase.name = dimensionValues.join('__');
		testCase.state = new TestCasePendingState();

		testCase.validate();
		return testCase;
	}


	// TODO Since this is platform-specific the validation and changing of the state should be moved to a different interface
	private validate(): void {

		if( !this.validateRequiredDimensions() ) {
			this.updateState( new TestCaseFailedState( INVALID_REASON_REQUIRED ) );
			return;
		}

		if( !this.validateResolution() ) {
			this.updateState( new TestCaseFailedState( INVALID_REASON_RESOLUTION ) );
		}
	}


	validateRequiredDimensions(): boolean {
		if( this.dimensions.has( Dimension.DEVICE ) ) return true;
		return this.dimensions.has( Dimension.PLATFORM );
	}

	validateResolution(): boolean {
		const resolution = this.dimensions.get( Dimension.RESOLUTION );
		if( resolution === undefined ) return true;

		const platform = this.dimensions.get( Dimension.PLATFORM );


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
		return !(this.state instanceof TestCaseFailedState);
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

	getLastStateDescription(): string {
		return this.state.description;
	}
}
