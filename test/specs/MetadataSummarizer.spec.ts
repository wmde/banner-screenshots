import { strict as assert } from 'assert';
import summarizeMetadata from "../../src/MetadataSummarizer";
import { testcase1, testcase2 } from "../fixtures/campaign_metadata";
import {serializeTestCase} from "../../src/Model/TestCaseSerializer";
import {Dimension} from "../../src/Model/Dimension";

function createMetaData( fieldGenerator ): any {
	const metaData = [];
	for (let fields of fieldGenerator ) {
		metaData.push( {
			campaign: '',
			createdOn: 0,
			testCases: [],
			...fields
		} );
	}
	return metaData;
}

const testCases = [ serializeTestCase( testcase1 ), serializeTestCase( testcase2 ) ]

describe( 'MetadataSummarizer', () => {

	it( 'creates an array of summary items', () => {

		const summary = summarizeMetadata( [
			{
				campaign: '00-ba-200416',
				createdOn: '2021-12-22T16:19:58.022Z',
				testCases,
				dimensions: [
					[ Dimension.DEVICE, ['iPhone_99'] ],
					[ Dimension.BANNER, ['CTRL'] ]
				],
			}
		] );

		assert.strictEqual( summary.length, 1 );
		assert.strictEqual( summary[0].campaign, '00-ba-200416' );
		assert.strictEqual( summary[0].createdOn, '2021-12-22T16:19:58.022Z' );
		assert.strictEqual( summary[0].testCaseCount, 2 );
	} );

	it( 'copies campaign campaigns', () => {

		const summary = summarizeMetadata( createMetaData( [
			{ campaign: '00-ba-200416' },
			{ campaign: '01-ba-200516' },
			{ campaign: '02-ba-200517' },
			{ campaign: '03-ba-200616' },
		] ) );

		assert.strictEqual( summary.length, 4 );
		assert.strictEqual( summary[0].campaign, '00-ba-200416' );
		assert.strictEqual( summary[1].campaign, '01-ba-200516' );
		assert.strictEqual( summary[2].campaign, '02-ba-200517' );
		assert.strictEqual( summary[3].campaign, '03-ba-200616' );
	} );

	it( 'copies creation dates', () => {
		const summary = summarizeMetadata( createMetaData( [
			{ createdOn: '2021-12-10T11:19:00.000Z' },
			{ createdOn: '2021-12-13T12:12:58.000Z' },
			{ createdOn: '2021-12-16T16:19:20.022Z' },
			{ createdOn: '2021-12-22T16:19:10.001Z' },
		] ) );

		assert.strictEqual( summary.length, 4 );
		assert.strictEqual( summary[0].createdOn, '2021-12-10T11:19:00.000Z' );
		assert.strictEqual( summary[1].createdOn, '2021-12-13T12:12:58.000Z' );
		assert.strictEqual( summary[2].createdOn, '2021-12-16T16:19:20.022Z' );
		assert.strictEqual( summary[3].createdOn, '2021-12-22T16:19:10.001Z' );
	} );

	it( 'summarizes number of test cases', () => {
		const summary = summarizeMetadata( createMetaData( [
			{ testCases: [ {}, {}, {}, {} ] },
			{ testCases: [ {}, {} ] },
			{ testCases: [ {}, {}, {}, {}, {}, {} ] },
		] ) );

		assert.strictEqual( summary.length, 3 );
		assert.strictEqual( summary[0].testCaseCount, 4 );
		assert.strictEqual( summary[1].testCaseCount, 2 );
		assert.strictEqual( summary[2].testCaseCount, 6 );
	} );
} );
