import partitionAll from "partition-all";

export class TBBatchRunner {
	constructor( browserFactory ) {
		this.browserFactory = browserFactory;
	}

	/**
	 *
	 * @param {number} concurrentRequestLimit
	 * @param {Array<TestCase>} testCases
	 * @param {function} testFunction
	 * @returns {Promise<void>}
	 */
	async runTestsInBatches(concurrentRequestLimit, testCases, testFunction ) {
		const validTestCases = testCases.filter( testCase => testCase.isValid() )
		const matrixBatches = partitionAll( concurrentRequestLimit, validTestCases );
		for( let i = 0; i< matrixBatches.length; i++ ) {
			const currentTestCaseBatch = matrixBatches[i];
			const browsers = await this.browserFactory.getBrowsers( currentTestCaseBatch );
			try {
				await Promise.all(currentTestCaseBatch.map( (testCase) => testFunction(testCase, browsers[testCase.getName()])))
			} catch( e ) {
				console.log( "At least one test case failed, but but we continue with the next batch. See test case states for details", e );
			}
		}
	}
}
