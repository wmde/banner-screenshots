import {isSerializedTestCase, SerializedTestCase} from "../Model/TestCaseSerializer";

export interface TestCaseMessage {
    testCase: SerializedTestCase;
    outputDirectory: string;
    testFunction: string;
    trackingName: string;
}

export function isTestCaseMessage( data: any ): data is TestCaseMessage {
    return typeof data === 'object' &&
        !!data.testCase &&
        !!data.outputDirectory &&
        !!data.testFunction &&
        !!data.trackingName &&
        isSerializedTestCase( data.testCase );
}

export type TestCaseMessageHandler = (TestCaseMessage) => Promise<void>;

export interface MetadataUpdateMessage {
    msgType: 'update';
    testCase: SerializedTestCase;
}

export interface MetadataInitMessage {
    msgType: 'init';
    testCases: SerializedTestCase[];
    campaignName: string;
}

export interface MetadataSummaryMessage {
    msgType: 'summary';
    campaignName: string;
    outputDirectory: string;
}

export type MetadataMessage = MetadataUpdateMessage |  MetadataInitMessage | MetadataSummaryMessage;
export type MetadataMessageHandler = (MetadataMessage) => Promise<void>;
