import { strict as assert } from 'assert';

import CampaignMetadata from "../../../src/Model/CampaignMetadata";
import {dimensions, createdOn, testcase1, testcase2, dimensionKeys} from "../../fixtures/campaign_metadata";
import {TestCase, TestCaseFinishedState} from "../../../src/Model/TestCase";

describe( 'CampaignMetadata', () => {

    it('can be created', () => {
        const meta = new CampaignMetadata( [testcase1, testcase2], dimensions, 'test_campaign', createdOn );

        assert.deepEqual( meta.dimensions, dimensions );
        assert.deepEqual( meta.getTestCases(), [testcase1, testcase2] );
        assert.equal( meta.getTestCase( testcase1.getName() ), testcase1, 'Test cases should be stored by reference' );
        assert.deepEqual( meta.createdOn, createdOn );
        assert.equal( meta.campaign, 'test_campaign' );
    } );

    it( 'fails getting a test case when the name does not match', () => {
        const meta = new CampaignMetadata( [testcase1], dimensions, 'test_campaign', createdOn );

        assert.throws( () => meta.getTestCase( 'I_do_not_exist' ) );
    } );

    it( 'can update test cases', () => {
        const meta = new CampaignMetadata( [testcase1, testcase2], dimensions, 'test_campaign', createdOn );
        // similar data to testcase1, but new object
        const newTestCase = TestCase.create( dimensionKeys, ['iPhone_99', 'CTRL'], 'https://example.com/banner' );

        meta.updateTestCase( newTestCase );

        assert.equal( newTestCase, meta.getTestCase( 'iPhone_99__CTRL' ) );
        assert.notEqual( testcase1, meta.getTestCase( 'iPhone_99__CTRL' ) );
    } );

    it( 'fails updating a test case when the name does not match', () => {
        const meta = new CampaignMetadata( [testcase1, testcase2], dimensions, 'test_campaign', createdOn );
        const newTestCase = TestCase.create( dimensionKeys, ['Samsung_Galaxy_99', 'CTRL'], 'https://example.com/banner' );

        assert.throws( () => meta.updateTestCase( newTestCase ) );
    } );

    it('defaults to pending test cases', () => {
        const meta = new CampaignMetadata( [testcase1, testcase2], dimensions, 'test_campaign', createdOn );

        assert.ok( meta.hasPendingTestCases() );
    } );

    it('check for non-pending test case state', () => {
        const finishedTestCase1 = TestCase.create( dimensionKeys, ['iPhone_99', 'CTRL'], 'https://example.com/banner' );
        const finishedTestCase2 = TestCase.create( dimensionKeys, ['iPhone_99', 'VAR'], 'https://example.com/banner' );
        finishedTestCase1.updateState( new TestCaseFinishedState( '' ) );
        finishedTestCase2.updateState( new TestCaseFinishedState( '' ) );
        const meta = new CampaignMetadata( [finishedTestCase1, finishedTestCase2], dimensions, 'test_campaign', createdOn );

        assert.ok( !meta.hasPendingTestCases() );
    } );

} );
