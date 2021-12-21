import { strict as assert } from 'assert';

import CampaignMetadata from "../../../src/Model/CampaignMetadata";
import { dimensions, createdOn, testcase1, testcase2 } from "../../fixtures/campaign_metadata";

describe( 'CampaignMetadata', () => {

    it('can be created', () => {
        const meta = new CampaignMetadata( [testcase1, testcase2], dimensions, 'test_campaign', createdOn);

        assert.deepEqual( meta.dimensions, dimensions );
        assert.deepEqual( meta.getTestCases(), [testcase1, testcase2] );
        assert.equal( meta.getTestCase( testcase1.getName() ), testcase1, 'Test cases should be stored by reference' );
        assert.deepEqual( meta.createdOn, createdOn );
        assert.equal( meta.campaign, 'test_campaign' );
    } );

    it( 'fails getting a test case when the name does not match', () => {
        const meta = new CampaignMetadata( [testcase1], dimensions, 'test_campaign', createdOn);

        assert.throws( () => meta.getTestCase( 'I_do_not_exist' ) );
    } );

} );
