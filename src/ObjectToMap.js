export default function objectToMap( obj ) {
	let map = new Map( Object.entries( obj ) );

	map.forEach( ( value, key ) => {
		if( !Array.isArray( value ) && typeof value === "object" ) {
			map.set( key, objectToMap( value ) );
		}
	} );

	return map;
}