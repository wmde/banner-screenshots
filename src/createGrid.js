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

function cutArray( arr, partitionSize ) {
	const partitions = []
	for( let i = 0; i < arr.length; i+= partitionSize ) {
		partitions.push( arr.slice( i, i + partitionSize ) );
	}
	return partitions;
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

	let rows = [testcases];
	rowDimensions.forEach( ( dimensionValues ) => {
		const sliceSize = rows[0].length / dimensionValues.length;
		const newRows = [];
		rows.forEach( row => cutArray( row, sliceSize ).forEach( newRow => newRows.push( newRow) ) )
		rows = newRows
	} );

	return rows;
}