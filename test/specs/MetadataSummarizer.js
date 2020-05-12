import { strict as assert } from 'assert';
import MetadataSummarizer from "../../src/MetadataSummarizer";

function createMetaData( fieldGenerator ) {
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

describe( 'MetadataSummarizer', () => {

	it( 'creates an array of summary items', () => {
		const summarizer = new MetadataSummarizer();

		const summary = summarizer.getSummary( [
			{
				campaign: '00-ba-200416',
				createdOn: 1586995200000,
				testCases: [
					// individual test case data will be ignored, this object is just here to show that
					{
						dimensions: [
							// ... not important
						],
						"valid": true,
						"invalidReason": "",
						"bannerUrl": "https://de.wikipedia.org/wiki/Wikipedia:Hauptseite?banner=B20_WMDE_Test_Desktop",
						"screenshotFilename": "win10__edge__1280x960__ctrl.png"
					},
					// 3 empty test cases
					{}, {}, {}
				]
			}
		] );

		assert.strictEqual( summary.length, 1 );
		assert.strictEqual( summary[0].campaign, '00-ba-200416' );
		assert.strictEqual( summary[0].createdOn, 1586995200000 );
		assert.strictEqual( summary[0].testCaseCount, 4 );
	} );

	it( 'summarizes campaigns', () => {
		const summarizer = new MetadataSummarizer();

		const summary = summarizer.getSummary( createMetaData( [
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

	it( 'summarizes creation dates', () => {
		const summarizer = new MetadataSummarizer();

		const summary = summarizer.getSummary( createMetaData( [
			{ createdOn: 1586995200000 },
			{ createdOn: 1589587200000 },
			{ createdOn: 1589587400000 },
			{ createdOn: 1589590000000 },
		] ) );

		assert.strictEqual( summary.length, 4 );
		assert.strictEqual( summary[0].createdOn, 1586995200000 );
		assert.strictEqual( summary[1].createdOn, 1589587200000 );
		assert.strictEqual( summary[2].createdOn, 1589587400000 );
		assert.strictEqual( summary[3].createdOn, 1589590000000 );
	} );

	it( 'summarizes number of test cases', () => {
		const summarizer = new MetadataSummarizer();

		const summary = summarizer.getSummary( createMetaData( [
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