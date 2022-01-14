import {isSerializedTestCase, SerializedTestCase} from "../Model/TestCaseSerializer";
import {DimensionEntries} from "../Model/MetadataSerializer";

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
    campaignName: string;
}

export interface MetadataInitMessage {
    msgType: 'init';
    testCases: SerializedTestCase[];
    campaignName: string;
    dimensions: DimensionEntries;
}

export interface MetadataSummaryMessage {
    msgType: 'summary';
}

export type MetadataMessage = MetadataUpdateMessage |  MetadataInitMessage | MetadataSummaryMessage;
export type MetadataMessageHandler = (MetadataMessage) => Promise<void>;
