import { TestCase } from "./TestCase";
import { Dimensions } from "./Dimension";

export default class CampaignMetadata {
    private testCases: Map<string, TestCase>
    readonly dimensions: Dimensions;
    readonly campaign: string;
    createdOn: Date;

    constructor(testCases: TestCase[], dimensions: Dimensions, campaign: string, createdOn?: Date) {
		const dimensionIdentifiers = [ ...dimensions.keys() ];
		const testCaseMismatchesDimensions = (tc: TestCase) => !tc.containsDimensions( dimensionIdentifiers );
		if ( testCases.find( testCaseMismatchesDimensions ) ) {
			throw new Error("Test case data does not match dimensions");
		}
        this.testCases = new Map( testCases.map( (testCase: TestCase) => [testCase.getName(), testCase] ) );
        this.dimensions = dimensions;
        this.campaign = campaign;
        this.createdOn = createdOn || new Date();
    }

    getTestCases(): TestCase[] {
        return Array.from( this.testCases.values() );
    }

    getTestCase( name: string ): TestCase {
        if ( !this.testCases.has( name ) ) {
            throw new Error( `Test case "${name}" not found` );
        }
        return this.testCases.get( name );
    }

    updateTestCase( testCase: TestCase ): void {
        let name = testCase.getName();
        if ( !this.testCases.has( name ) ) {
            throw new Error( `Test case "${name}" not part of this data set` );
        }
        this.testCases.set( name, testCase );
    }

    hasPendingTestCases(): boolean {
        for ( const testCase of this.testCases.values() ) {
            if ( testCase.getLastStateName() === 'pending' ) {
                return true;
            }
        }
        return false;
    }
}
