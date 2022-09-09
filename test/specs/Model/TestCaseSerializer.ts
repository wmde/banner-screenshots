import { strict as assert } from 'assert';
import {
    TestCase,
    TestCaseFailedState,
    TestCaseFinishedState,
    TestCaseIsRunningState,
    TestCasePendingState
} from "../../../src/Model/TestCase";
import {
    DEFAULT_DESCRIPTION,
    serializeTestCase,
    serializeTestCaseState, unserializeTestCase,
    unserializeTestCaseState
} from "../../../src/Model/TestCaseSerializer";
import { Dimension } from "../../../src/Model/Dimension";

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
        const failedState = new TestCaseFailedState('Could not reticulate the splines', Error( 'Reticulation not allowed, bad spline!' ) );
        const failedStateWithoutError = new TestCaseFailedState('Could not reticulate the splines' );

        assert.deepEqual(
            serializeTestCaseState( failedState ),
            { stateName: "failed", description: 'Could not reticulate the splines', error: 'Reticulation not allowed, bad spline!' }
        );
        assert.deepEqual(
            serializeTestCaseState( failedStateWithoutError ),
            { stateName: "failed", description: 'Could not reticulate the splines' }
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

    it('fails when serialized data is not an object', () => {
        const faultyData = [
            [ '{"stateName":"pending"}', 'unserialized String' ],
            [ '', 'empty String' ],
            [ 0, 'Number' ],
            [ true, 'Boolean' ],
        ];
        faultyData.forEach( ([misshapenObj, description]) => {
            // @ts-ignore-errors
            assert.throws(() => unserializeTestCaseState(misshapenObj), null, `${description} should cause an error`)
        } );
    } );

    it('fails when state name has unknown value', () => {
        assert.throws(() => unserializeTestCaseState({stateName: 'of emergency'}))
    } );
} );

describe('serializeTestCase', () => {
    it('serializes a test case', () => {
        const testCase = TestCase.create(
            [Dimension.PLATFORM, Dimension.BANNER, Dimension.RESOLUTION],
            ['firefox', 'ctrl', '1200x960'],
            'https://example.com/'
        );

        assert.deepEqual(
            serializeTestCase( testCase ),
            {
				dimensions: [
					[ 'platform', "firefox" ],
					[ 'banner', "ctrl" ],
					[ 'resolution', '1200x960'],
				],
                bannerUrl: 'https://example.com/',
                state: { stateName: 'pending', description: 'Test case is pending' },
                screenshotFilename: 'firefox__ctrl__1200x960.png',
                valid: true
        } );
    } );
} );

describe('unserializeTestCase', () => {
    it('unserializes a test case', () => {
        const expectedTestCase = TestCase.create(
            [Dimension.PLATFORM, Dimension.BANNER, Dimension.RESOLUTION],
            ['firefox', 'ctrl', '1200x960'],
            'https://example.com/'
        );

        assert.deepEqual(
            unserializeTestCase( {
                dimensions: [
					[ 'platform', "firefox" ],
					[ 'banner', "ctrl" ],
					[ 'resolution', '1200x960'],
				],
                bannerUrl: 'https://example.com/',
                state: { stateName: 'pending', description: 'Test case is pending' },
                screenshotFilename: 'firefox__ctrl__1200x960.png',
                valid: true
            } ),
            expectedTestCase,
        );
    } );

    it('ignores valid state and file name in serialized data', () => {
        const expectedTestCase = TestCase.create(
            [Dimension.PLATFORM, Dimension.BANNER, Dimension.RESOLUTION],
            ['firefox', 'ctrl', '1200x960'],
            'https://example.com/'
        );
        expectedTestCase.updateState(new TestCaseFailedState( "The circuit's dead there's something wrong" ));

        const testCase = unserializeTestCase( {
                dimensions: [
					[ 'platform', "firefox" ],
					[ 'banner', "ctrl" ],
					[ 'resolution', '1200x960'],
				],
				bannerUrl: 'https://example.com/',
                state: { stateName: 'failed', description: "The circuit's dead there's something wrong" },
                screenshotFilename: 'Not_A_Valid_File_Name.png',
                valid: true
            } );

        assert.equal( testCase.isValid(), false );
        assert.equal( testCase.getScreenshotFilename(), 'firefox__ctrl__1200x960.png' );
    } );

    it( 'fails when serialized data is invalid', () => {
        const faultyData = [
            [ '{}', 'String' ],
            [ 0, 'Number' ],
            [ true, 'Boolean' ],
            [ {}, 'Empty object' ],
            [ { bannerUrl: 'https://example.com/', }, 'missing dimensios' ],
            [ { dimensions: [ ['operating_system', "Windows" ] ], bannerUrl: 'https://example.com/', }, 'unsupported dimension' ],
            [ { dimensions: [ ['platform', 'firefox' ] ] }, 'missing banner url' ],
        ];

        faultyData.forEach( ([misshapenObj, description]) => {
            // @ts-ignore-errors
            assert.throws(() => unserializeTestCase(misshapenObj), null, `${description} should cause an error`)
        } );
    } );

    it( 'creates pending state when state is missing', () => {
        const testCase = unserializeTestCase( {
            dimensions: [ ['platform', 'firefox' ] ],
            bannerUrl: 'https://example.com/',
        } );

        assert.equal( testCase.getLastStateDescription(), 'Test case is pending' );
    } );
} );

