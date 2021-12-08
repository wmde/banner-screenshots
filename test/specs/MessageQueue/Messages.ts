import {PLATFORM} from "../../../src/Dimensions";
import {strict as assert} from "assert";
import {isTestCaseMessage} from "../../../src/MessageQueue/Messages";

describe('isTestCaseMessage', () => {

    const validSerializedTestCase = {
        dimensionKeys: [PLATFORM],
        dimensionValues: ['firefox'],
        bannerUrl: 'https://example.com/banner'
    }

    it('fails with empty or missing data', () => {
        const faultyData = [
            [ '{}', 'String' ],
            [ 0, 'Number' ],
            [ true, 'Boolean' ],
            [ {}, 'Empty object' ],
            [ {outputDirectory: 'screenshots', testFunction:'doSomething', trackingName:'test' }, 'missing testCase' ],
            [ {testCase: validSerializedTestCase, trackingName:'test', testFunction:'doSomething' }, 'missing outputDirectory' ],
            [ {testCase: validSerializedTestCase, outputDirectory: 'screenshots', trackingName:'test' }, 'missing testFunction' ],
            [ {testCase: validSerializedTestCase, outputDirectory: 'screenshots', testFunction:'doSomething' }, 'missing trackingname' ],
        ] as const;

        faultyData.forEach( ([data, description]) => {
            assert.equal( isTestCaseMessage( data ), false )
        } );
    } );

    it('succeeds with complete data', () => {
        assert.ok( isTestCaseMessage({
            testCase: validSerializedTestCase,
            outputDirectory: 'screenshots',
            testFunction:'doSomething',
            trackingName:'test'
        } ) );
    })
} )
