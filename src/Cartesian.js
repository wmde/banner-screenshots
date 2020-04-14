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

export default cartesian;