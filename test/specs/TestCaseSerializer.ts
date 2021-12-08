import { strict as assert } from 'assert';
import {
    TestCaseFailedState,
    TestCaseFinishedState,
    TestCaseIsRunningState,
    TestCasePendingState
} from "../../src/TestCase";
import {DEFAULT_DESCRIPTION, serializeTestCaseState, unserializeTestCaseState} from "../../src/TestCaseSerializer";

describe('serializeTestCaseState', () => {
    it( 'serializes pending state', () => {
        const state = new TestCasePendingState();

        assert.deepEqual(
            serializeTestCaseState( state),
            { stateName: "pending", description: "Test case is pending"}
        );
    } );

    it( 'serializes running state', () => {
        const state = new TestCaseIsRunningState('Checked for progress bar' );

        assert.deepEqual(
            serializeTestCaseState( state),
            { stateName: "running", description: 'Checked for progress bar'}
        );
    } );

    it( 'serialized failed state', () => {
        const state = new TestCaseFailedState('Could not reticulate the splines', Error('Reticulation not allowed, bad spline!') );

        assert.deepEqual(
            serializeTestCaseState( state),
            { stateName: "failed", description: 'Could not reticulate the splines', error: 'Reticulation not allowed, bad spline!'}
        );
    } );

    it( 'serializes finished state', () => {
        const state = new TestCaseFinishedState('Looks good!' );

        assert.deepEqual(
            serializeTestCaseState( state),
            { stateName: "finished", description: 'Looks good!'}
        );
    } );

} );

describe('unserializeTestCaseState', () => {
    it('unserializes pending state', () => {
        const expectedState = new TestCasePendingState();

        assert.deepEqual(
            unserializeTestCaseState({stateName: 'pending'} ),
            expectedState
        )
    } );

    it('unserializes running state', () => {
        const expectedState = new TestCaseIsRunningState( 'Found Banner' );

        assert.deepEqual(
            unserializeTestCaseState({stateName: 'running', description: 'Found Banner'} ),
            expectedState
        );
    } );

    it('unserializes failed state', () => {
        const expectedState = new TestCaseFailedState( 'Timed out', Error('Server is busy') );
        const expectedStateWithoutError = new TestCaseFailedState( 'Timed out' );

        assert.deepEqual(
            unserializeTestCaseState({stateName: 'failed', description: 'Timed out', error: 'Server is busy'} ),
            expectedState
        );
        assert.deepEqual(
            unserializeTestCaseState({stateName: 'failed', description: 'Timed out' } ),
            expectedStateWithoutError
        );
    } );

    it('unserializes finished state', () => {
        const expectedState = new TestCaseFinishedState( 'Looks good!' );

        assert.deepEqual(
            unserializeTestCaseState({stateName: 'finished', description: 'Looks good!'} ),
            expectedState
        );
    } );

    it("sets default description if it's missing", () => {
        const statesWithMissingDescription = [
            {stateName: 'running'},
            {stateName: 'finished'},
            {stateName: 'failed'},
        ];
        statesWithMissingDescription.forEach(
            (obj) => assert.equal(
                unserializeTestCaseState(obj).description,
                DEFAULT_DESCRIPTION
            )
        );
    } );

    it('fails when state name is not set', () => {
        // @ts-expect-error
        assert.throws(() => unserializeTestCaseState({}))
    } );

    it('fails when state name has unknown value not set', () => {
        assert.throws(() => unserializeTestCaseState({stateName: 'of emergency'}))
    } );
} );

