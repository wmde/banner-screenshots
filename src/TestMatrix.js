// See https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
const concatFunction = ( leftArray, rightArray ) => [].concat( ...leftArray.map(
	leftValue => rightArray.map(
		rightValue => [].concat( leftValue, rightValue )
	)
) );

const cartesian = ( leftArray, rightArray, ...additionalArrays ) => {
	if( rightArray ) {
		return cartesian( concatFunction( leftArray, rightArray ), ...additionalArrays );
	}

	return leftArray;
};

export class TestMatrix {

	constructor() {
		this.matrix = [];
		this.dimensions = new Map();
	}


	addDimension( key, values ) {
		this.dimensions.set( key, values );
		return this;
	}


	build() {
		this.matrix = cartesian.apply( this, Array.from(  this.dimensions.values() ) );
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