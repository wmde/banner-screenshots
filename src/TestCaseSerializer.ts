import {
    TestCaseFailedState,
    TestCaseFinishedState,
    TestCaseIsRunningState,
    TestCasePendingState,
} from "./TestCase";

interface SerializedTestCaseState {
    stateName: string;
    description: string;
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


