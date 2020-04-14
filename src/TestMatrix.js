import cartesian from './Cartesian';

export const BANNER = 'banner';
export const BROWSER = 'browser';
export const DEVICE = 'device';
export const OPERATING_SYSTEM = 'operating_system';
export const ORIENTATION = 'orientation';
export const RESOLUTION = 'resolution';

const ALLOWED_DIMENSIONS = [ BANNER, BROWSER, DEVICE, OPERATING_SYSTEM, ORIENTATION, RESOLUTION ];

const BROWSERS_EXCLUDED_OPERATING_SYSTEMS = [
	{
		name: 'ie11',
		excluded: [ 'win10', 'linux', 'macos' ]
	},
	{
		name: 'edge',
		excluded: [ 'win7', 'linux', 'macos' ]
	},
	{
		name: 'safari',
		excluded: [ 'win7', 'win10', 'linux' ]
	},
	{
		name: 'chrome',
		excluded: [ 'win7' ]
	}
];

export class TestMatrix {

	constructor() {
		this.matrix = [];
		this.dimensions = new Map();
	}


	addDimension( key, values ) {
		if( ALLOWED_DIMENSIONS.indexOf( key ) === -1 ) {
			throw new Error( `Invalid dimension: ${ key }` );
		}
		this.dimensions.set( key, values );
		return this;
	}


	build() {
		this.validateDimensions();

		let matrix = cartesian.apply( this, Array.from( this.dimensions.values() ) );
		this.matrix = matrix.filter( row => {
			return this.filterBrowsers( row );
			// TODO && this.filterXXX
		} );
	}


	validateDimensions() {
		if( this.dimensions.has( DEVICE ) ) {
			return;
		}

		if( !this.dimensions.has( OPERATING_SYSTEM ) || !this.dimensions.has( BROWSER ) ) {
			throw new Error( 'Dimensions are missing a required column, please specify a device name or a combination of browser and OS' );
		}
	}


	filterBrowsers( row ) {
		const browserColumn = this.getDimensions().indexOf( BROWSER );
		const osColumn = this.getDimensions().indexOf( OPERATING_SYSTEM );
		if( browserColumn === -1 || osColumn === -1 ) {
			return true;
		}

		let shouldRemove = false;
		BROWSERS_EXCLUDED_OPERATING_SYSTEMS.forEach( browser => {
			if( row[ browserColumn ] !== browser.name ) {
				return;
			}
			if( browser.excluded.indexOf( row[ osColumn ] ) > -1 ) {
				shouldRemove = true;
			}
		} );

		return !shouldRemove;
	}


	/**
	 * @return {string[]}
	 */
	getDimensions() {
		return Array.from( this.dimensions.keys() );
	}


	getDimensionArray() {
		return this.matrix;
	}

	/**
	 * Convert a matrix row into a map
	 *
	 * @param {string[]} dimensionValues A matrix row
	 * @return {Map<string, string>}
	 */
	getDimensionMap( dimensionValues ) {
		const dimensionKeys = this.getDimensions();
		return new Map( dimensionValues.map( (v, i ) => [ dimensionKeys[i], v ] ) );
	}


	selectImagesForDimensions( ...dimensions ) {
		//return new Map( [] => 'imagename' )
	}

}