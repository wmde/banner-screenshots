import { TestCase } from "./TestCase";
import { Dimensions } from "./Dimension";

export default class CampaignMetadata {
    private testCases: Map<string, TestCase>
    readonly dimensions: Dimensions;
    readonly campaign: string;
    createdOn: Date;

    constructor(testCases: TestCase[], dimensions: Dimensions, campaign: string, createdOn?: Date) {
        this.testCases = new Map( testCases.map( (testCase: TestCase) => [testCase.getName(), testCase] ) );
        this.dimensions = dimensions;
        this.campaign = campaign;
        this.createdOn = createdOn || new Date();
    }

    getTestCases(): TestCase[] {
        return Array.from( this.testCases.values() );
    }

    getTestCase( name ): TestCase {
        if ( !this.testCases.has( name ) ) {
            throw new Error( `Test case ${name} not found` );
        }
        return this.testCases.get( name );
    }
}
