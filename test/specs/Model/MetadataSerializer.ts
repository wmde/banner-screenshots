import { strict as assert } from 'assert';

import {Dimension} from "../../../src/Model/Dimension";
import {serializeCampaignMetadata, unserializeCampaignMetadata} from "../../../src/Model/MetadataSerializer";
import { serializeTestCase } from "../../../src/Model/TestCaseSerializer";
import * as Fixtures from '../../fixtures/campaign_metadata';

describe( 'serializeCampaignMetadata', () => {

    it('serializes date to string', () => {
        const serialized =  serializeCampaignMetadata( Fixtures.campaignMetadata );

        assert.equal( serialized.createdOn, '2021-12-24T00:00:00.000Z' );
    } );

    it('serializes campaign name', () => {
        const serialized =  serializeCampaignMetadata( Fixtures.campaignMetadata );

        assert.equal( serialized.campaign, 'test_campaign' );
    } );

    it( 'serializes dimensions', () => {
        const serialized =  serializeCampaignMetadata( Fixtures.campaignMetadata );
        const expectedDimensions = [
            [ 'device', ['iPhone_99'] ],
            [ 'banner', ['CTRL', 'VAR'] ],
        ];

        assert.deepEqual( serialized.dimensions, expectedDimensions );
    } );

    it( 'serializes test cases', () => {
        const serialized =  serializeCampaignMetadata( Fixtures.campaignMetadata );

        assert.equal( serialized.testCases.length, 2 );
        assert.deepEqual( serialized.testCases[0], serializeTestCase( Fixtures.testcase1 ) );
    } );

} );

describe( 'unserializeCampaignMetadata', () => {
    const serializedObject = {
        createdOn: '2021-12-24T00:00:00.000Z',
        campaign: 'test_campaign',
        dimensions: [
            [ 'device', ['iPhone_99'] ],
            [ 'banner', ['CTRL'] ],
        ],
        testCases: [
            serializeTestCase(Fixtures.testcase1),
            serializeTestCase(Fixtures.testcase2)
        ]
    };


    it('unserializes date', () => {
        const newMeta =  unserializeCampaignMetadata( serializedObject );

        assert.deepEqual( newMeta.createdOn, Fixtures.createdOn );
    } );

    it('rejects invalid date', () => {
        assert.throws( () => {
            unserializeCampaignMetadata({...serializedObject, createdOn: 'Haha, no date here'} );
        } )
    } );

    it( 'unserializes campaign name', () => {
        const newMeta =  unserializeCampaignMetadata( serializedObject );

        assert.deepEqual( newMeta.campaign, 'test_campaign' );
    } );

    it( 'unserializes dimensions', () => {
        const newMeta =  unserializeCampaignMetadata( serializedObject );

        assert.equal( newMeta.dimensions.size, 2 );
        assert.ok( newMeta.dimensions.has( Dimension.DEVICE ) );
        assert.ok( newMeta.dimensions.has( Dimension.BANNER ) );
        assert.deepEqual( newMeta.dimensions.get( Dimension.DEVICE ), ['iPhone_99'] );
        assert.deepEqual( newMeta.dimensions.get( Dimension.BANNER ), ['CTRL'] );
    } );

    it( 'fails unserialization with unknown dimensions', () => {
        assert.throws( () => unserializeCampaignMetadata( {
            ...serializedObject,
            dimensions: [
                ['time', ['warp']],
                ['space', ['the final frontier']]
            ]
        } ) );
    } );

    it( 'unserializes test cases as new instances', () => {
        const newMeta =  unserializeCampaignMetadata( serializedObject );

        assert.equal( newMeta.getTestCases().length, 2 );
        // check for value equality
        assert.deepEqual( newMeta.getTestCase( Fixtures.testcase1.getName() ), Fixtures.testcase1 );
        assert.deepEqual( newMeta.getTestCase( Fixtures.testcase2.getName() ), Fixtures.testcase2 );
        // check for instance inequality
        assert.notEqual( newMeta.getTestCase( Fixtures.testcase1.getName() ), Fixtures.testcase1 );
        assert.notEqual( newMeta.getTestCase( Fixtures.testcase2.getName() ), Fixtures.testcase2 );
    } );
})
