import { strict as assert } from 'assert';
import {
    TestCaseFailedState,
    TestCaseFinishedState,
    TestCaseIsRunningState,
    TestCasePendingState
} from "../../src/TestCase";
import {serializeTestCaseState} from "../../src/TestCaseSerializer";

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

} )
