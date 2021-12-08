import {SerializedTestCase} from "../TestCaseSerializer";

export interface TestCaseMessage {
    testCase: SerializedTestCase;
    outputDirectory: string;
    testFunction: string;
    trackingName: string;
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
