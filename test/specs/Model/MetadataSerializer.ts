import { strict as assert } from 'assert';

import {Dimension} from "../../../src/Model/Dimension";
import {TestCase} from "../../../src/Model/TestCase";
import CampaignMetadata from "../../../src/Model/CampaignMetadata";
import {serializeCampaignMetadata, unserializeCampaignMetadata} from "../../../src/Model/MetadataSerializer";
import {SerializedTestCase, serializeTestCase} from "../../../src/Model/TestCaseSerializer";

// Fixtures for all tests
const dimensions = new Map( [
    [ Dimension.DEVICE, ['iPhone 99'] ],
    [ Dimension.BANNER, ['CTRL'] ]
] );
const dimensionKeys = Array.from( dimensions.keys() );
const createdOn = new Date( '2021-12-24' );
const testcase1 = TestCase.create( dimensionKeys, ['iPhone 99', 'CTRL'], 'https>//example.com/banner');
const testcase2 = TestCase.create( dimensionKeys, ['iPhone 99', 'VAR'], 'https>//example.com/banner');

describe( 'serializeCampaignMetadata', () => {

    const meta = new CampaignMetadata( [testcase1, testcase2], dimensions, 'test_campaign', createdOn );

    it('serializes date to string', () => {
        const serialized =  serializeCampaignMetadata( meta );

        assert.equal( serialized.createdOn, '2021-12-24T00:00:00.000Z' );
    } );

    it('serializes campaign name', () => {
        const serialized =  serializeCampaignMetadata( meta );

        assert.equal( serialized.campaign, 'test_campaign' );
    } );

    it( 'serializes dimensions', () => {
        const serialized =  serializeCampaignMetadata( meta );
        const expectedDimensions = [
            [ 'device', ['iPhone 99'] ],
            [ 'banner', ['CTRL'] ],
        ];

        assert.deepEqual( serialized.dimensions, expectedDimensions );
    } );

    it( 'serializes test cases', () => {
        const serialized =  serializeCampaignMetadata( meta );

        assert.equal( serialized.testCases.length, 2 );
        assert.deepEqual( serialized.testCases[0], serializeTestCase( testcase1 ) );
    } );

} );

describe( 'unserializeCampaignMetadata', () => {
    const meta = new CampaignMetadata( [testcase1, testcase2], dimensions, 'test_campaign', createdOn );
    const serializedObject = {
        createdOn: '2021-12-24T00:00:00.000Z',
        campaign: 'test_campaign',
        dimensions: [
            [ 'device', ['iPhone 99'] ],
            [ 'banner', ['CTRL'] ],
        ],
        testCases: [
            serializeTestCase(testcase1),
            serializeTestCase(testcase2)
        ]
    };


    it('unserializes date', () => {
        const newMeta =  unserializeCampaignMetadata( serializedObject );

        assert.deepEqual( newMeta.createdOn, meta.createdOn );
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
        assert.deepEqual( newMeta.dimensions.get( Dimension.DEVICE ), ['iPhone 99'] );
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
        assert.deepEqual( newMeta.getTestCase( testcase1.getName() ), testcase1 );
        assert.deepEqual( newMeta.getTestCase( testcase2.getName() ), testcase2 );
        // check for instance inequality
        assert.notEqual( newMeta.getTestCase( testcase1.getName() ), testcase1 );
        assert.notEqual( newMeta.getTestCase( testcase2.getName() ), testcase2 );
    } );
})
