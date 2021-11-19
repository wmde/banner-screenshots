import { TestCase } from "../TestCase";

export interface TestCaseMessage {
    dimensionKeys: string[];
    dimensionValues: string[];
    bannerUrl: string;
    outputDirectory: string;
    testFunction: string;
    trackingName: string;
}

export type TestCaseMessageHandler = (TestCaseMessage) => Promise<void>;

export interface MetadataUpdateMessage {
    msgType: 'update';
    testCase: TestCase;
}

export interface MetadataInitMessage {
    msgType: 'init';
    testCases: TestCase[];
    campaignName: string;
}

export interface MetadataSummaryMessage {
    msgType: 'summary';
    campaignName: string;
    outputDirectory: string;
}

export type MetadataMessage = MetadataUpdateMessage |  MetadataInitMessage | MetadataSummaryMessage;
export type MetadataMessageHandler = (MetadataMessage) => Promise<void>;