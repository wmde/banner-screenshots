import { strict as assert } from 'assert';

import {Dimension} from "../../../src/Model/Dimension";
import {TestCase} from "../../../src/Model/TestCase";
import CampaignMetadata from "../../../src/Model/Metadata";

describe( 'CampaignMetadata', () => {
    // Fixtures
    const dimensions = new Map( [
        [ Dimension.DEVICE, ['iPhone 99'] ],
        [ Dimension.BANNER, ['CTRL'] ]
    ] );
    const createdOn = new Date( '2021-12-24' );
    const testcase = TestCase.create(
        Array.from( dimensions.keys() ),
        ['iPhone 99', 'CTRL'],
        'https://example.com/banner'
    );

    it('can be created', () => {
        const meta = new CampaignMetadata( [testcase], dimensions, 'test_campaign', createdOn);

        assert.deepEqual( meta.dimensions, dimensions );
        assert.deepEqual( meta.getTestCases(), [testcase] );
        assert.equal( meta.getTestCase(testcase.getName() ), testcase, 'Test cases should be stored by reference' );
        assert.deepEqual( meta.createdOn, createdOn );
        assert.equal( meta.campaign, 'test_campaign' );
    } );

    it( 'fails getting a test case when the name does not match', () => {
        const meta = new CampaignMetadata( [testcase], dimensions, 'test_campaign', createdOn);

        assert.throws( () => meta.getTestCase( 'I_do_not_exist' ) );
    } );

} );
