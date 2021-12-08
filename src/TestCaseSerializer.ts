import {
    TestCaseFailedState,
    TestCaseFinishedState,
    TestCaseIsRunningState,
    TestCasePendingState,
} from "./TestCase";

interface SerializedTestCaseState {
    stateName: string;
    description?: string;
    error?: string;
}

type SerializableStates = TestCasePendingState|TestCaseFailedState|TestCaseFinishedState|TestCaseIsRunningState;

export function serializeTestCaseState( state: SerializableStates ): SerializedTestCaseState {
    const serialized: SerializedTestCaseState = {
        stateName: state.stateName,
        description: state.description
    };
    if (state.stateName === 'failed') {
        serialized.error = state.error.message;
    }
    return serialized;
}

export const DEFAULT_DESCRIPTION = 'UNKNOWN DESCRIPTION - check serializer and data';

export function unserializeTestCaseState( stateObj: SerializedTestCaseState ): SerializableStates {
    if ( !stateObj.hasOwnProperty('stateName')) {
        throw new Error("No stateName property found")
    }
    switch ( stateObj.stateName ) {
        case "pending": return new TestCasePendingState();
        case "running": return new TestCaseIsRunningState( stateObj.description || DEFAULT_DESCRIPTION );
        case "finished": return new TestCaseFinishedState( stateObj.description || DEFAULT_DESCRIPTION );
        case "failed":
            const err = stateObj.error ? new Error( stateObj.error ) : undefined;
            return new TestCaseFailedState( stateObj.description || DEFAULT_DESCRIPTION, err );
        default:
            throw new Error( 'Unknown state type: ' + stateObj.stateName );
    }
}
