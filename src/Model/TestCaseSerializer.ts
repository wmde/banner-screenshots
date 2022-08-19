import {
    TestCase,
    TestCaseFailedState,
    TestCaseFinishedState,
    TestCaseIsRunningState,
    TestCasePendingState,
} from "./TestCase";
import { isValidDimension, Dimension } from "./Dimension";

interface SerializedTestCaseState {
    stateName: string;
    description?: string;
    error?: string;
}

export interface SerializedTestCase {
    dimensions: [string, string][],
    bannerUrl: string,
    state?: SerializedTestCaseState,
    screenshotFilename?: string,
    valid?: boolean
}

type SerializableStates = TestCasePendingState|TestCaseFailedState|TestCaseFinishedState|TestCaseIsRunningState;

export function serializeTestCaseState( state: SerializableStates ): SerializedTestCaseState {
    const serialized: SerializedTestCaseState = {
        stateName: state.stateName,
        description: state.description
    };
    if (state.stateName === 'failed' && state.error?.message ) {
        serialized.error = state.error.message;
    }
    return serialized;
}

export const DEFAULT_DESCRIPTION = 'UNKNOWN DESCRIPTION - check serializer and data';

export function isSerializedTestCaseState( data: any ): data is SerializedTestCase {
    return typeof data === 'object' && !!data.stateName;
}

export function unserializeTestCaseState( stateObj: SerializedTestCaseState ): SerializableStates {
    if ( !isSerializedTestCaseState( stateObj ) ) {
        throw new Error( 'Invalid state object')
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

export function serializeTestCase( testCase: TestCase ): SerializedTestCase {
    const state = Reflect.get(testCase, 'state')
    return {
        dimensions: Array.from( testCase.getDimensions().entries() ),
        bannerUrl: testCase.getBannerUrl(),
        state: serializeTestCaseState( state ),
        screenshotFilename: testCase.getScreenshotFilename(),
        valid: testCase.isValid()
    }
}

export function isSerializedTestCase( data: any ): data is SerializedTestCase {
    return (typeof data) === 'object' && ['dimensions', 'bannerUrl'].reduce(
        (isValid: boolean, propName: string ): boolean => {
            return isValid && ( data.hasOwnProperty(propName) && !!data[propName] );
        },
        true
    );
}

export function unserializeTestCase( testCaseObj: SerializedTestCase ): TestCase {
    if (!isSerializedTestCase( testCaseObj ) ) {
        throw new Error( 'Invalid test case data' );
    }
	
	const dimensions = new Map<Dimension, string>();

	testCaseObj.dimensions.forEach( ( [ dimensionKey, dimensionValue] ) => {
		if ( !isValidDimension( dimensionKey ) ) {
            throw new Error( `${dimensionKey} is not a valid dimension name.` )
        }
		dimensions.set( dimensionKey, dimensionValue );
	} );

    const testCase = TestCase.create(
        Array.from( dimensions.keys() ),
		Array.from( dimensions.values() ),
        testCaseObj.bannerUrl
    );
    if ( testCaseObj.state ) {
      testCase.updateState( unserializeTestCaseState( testCaseObj.state ) );
    }
    return testCase;
}
