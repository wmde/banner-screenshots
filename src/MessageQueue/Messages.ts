export interface TestCaseMessage {
    dimensionKeys: string[];
    dimensionValues: string[];
    bannerUrl: string;
    outputDirectory: string;
    testFunction: string;
    trackingName: string;
}

export type TestCaseMessageHandler = (TestCaseMessage) => Promise<void>;
