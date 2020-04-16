function createDimensionSorter( dimensionOrder ) {
	/**
	 * @param {TestCase} testcaseA
	 * @param {TestCase} testcaseB
	 * @return number
	 */
	return function( testcaseA, testCaseB ) {
		for( let i=0; i < dimensionOrder.length; i++ ) {
			const dimension = dimensionOrder[i];
			if ( testcaseA.getDimension( dimension ) > testCaseB.getDimension( dimension ) ) {
				return 1;
			}
			if ( testcaseA.getDimension( dimension ) < testCaseB.getDimension( dimension ) ) {
				return -1;
			}
		}
		return 0;
	}
}

/**
 *
 * @param {TestCase[]} testcases
 * @param {Map<string,string[]>} rowDimensions
 * @param {string[]} orderByDimensions
 */
export function createGrid( testcases, rowDimensions, orderByDimensions ) {
	const compareAllDimensions = createDimensionSorter( Array.from( rowDimensions.keys() ).concat( orderByDimensions ) );
	testcases.sort( compareAllDimensions );

	// we just support 1 key at the moment, we'd have to loop rowDimensions to slice differently and repeatedly
	if( rowDimensions.size !== 1 ) {
		throw Error( "rowDimension must have exactly 1 dimension" )
	}
	const currentDimension  = rowDimensions.values().next(); // get 1st value as Iterator result object
	const sliceSize = testcases.length / currentDimension.value.length;
	const rows = [];
	for( let i = 0; i < testcases.length; i+= sliceSize ) {
		rows.push( testcases.slice( i, i + sliceSize ) );
	}
	return rows;
}