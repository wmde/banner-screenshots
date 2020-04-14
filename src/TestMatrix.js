import cartesian from './Cartesian';

export const BANNER = 'banner';
export const RESOLUTION = 'resolution';
export const OPERATING_SYSTEM = 'operating_system';
export const BROWSER = 'browser';

const ALLOWED_DIMENSIONS = [ BANNER, BROWSER, RESOLUTION, OPERATING_SYSTEM ];

const BROWSERS_EXCLUDED_OPERATING_SYSTEMS = [
	{
		name: 'ie11',
		excluded : [ 'win10', 'linux', 'macos' ]
	},
	{
		name: 'edge',
		excluded : [ 'win7', 'linux', 'macos' ]
	},
	{
		name: 'safari',
		excluded : [ 'win7', 'win10', 'linux' ]
	},
	{
		name: 'chrome',
		excluded : [ 'win7' ]
	}
];

export class TestMatrix {

	constructor() {
		this.matrix = [];
		this.dimensions = new Map();
	}


	addDimension( key, values ) {
		if ( ALLOWED_DIMENSIONS.indexOf( key ) === -1 ) {
			throw new Error( `Invalid dimension: ${key}` );
		}
		this.dimensions.set( key, values );
		return this;
	}


	build() {
		let matrix = cartesian.apply( this, Array.from(  this.dimensions.values() ) );
		this.matrix = matrix.filter( row => {
			return this.filterBrowsers( row );
			 // TODO && this.filterXXX
		} );
	}


	filterBrowsers( row )
	{
		const browserColumn = this.getDimensions().indexOf( BROWSER );
		const osColumn = this.getDimensions().indexOf( OPERATING_SYSTEM );
		if ( browserColumn === -1 || osColumn === -1 ) {
			return true;
		}

		let shouldRemove = false;
		BROWSERS_EXCLUDED_OPERATING_SYSTEMS.forEach( browser => {
			if( row[ browserColumn ] !== browser.name  ) {
				return;
			}
			if ( browser.excluded.indexOf( row[ osColumn ] ) > -1 ) {
				shouldRemove = true;
			}
		} );

		return !shouldRemove;
	}


	getDimensions() {
		return Array.from( this.dimensions.keys() );
	}


	getDimensionArray()
	{
		return this.matrix;
	}


	selectImagesForDimensions( ...dimensions ) {
		//return new Map( [] => 'imagename' )
	}

}