import { shootBanner } from './shootBanner.js';
import { shootBanner as shootOldBanner } from './shootOldBanner.js';

const testFunctions = {
	shootBanner,
	shootOldBanner
}

/**
 * @param {string} functionName
 * @returns {boolean}
 */
export function testFunctionExists( functionName ) {
	return typeof testFunctions[functionName] === 'function';
}

/**
 * @param {string} functionName
 * @returns {function}
 */
export function getTestFunction( functionName ) {
	if (!testFunctionExists(functionName)) {
		throw new Error(`Test function ${functionName} does not exist! Please check your campaign configuration file.` );
	}
	return testFunctions[functionName];
}
