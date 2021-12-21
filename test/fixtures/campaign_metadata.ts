import {Dimension} from "../../src/Model/Dimension";
import {TestCase} from "../../src/Model/TestCase";
import CampaignMetadata from "../../src/Model/CampaignMetadata";

export const dimensions = new Map( [
    [ Dimension.DEVICE, ['iPhone 99'] ],
    [ Dimension.BANNER, ['CTRL'] ]
] );
export const dimensionKeys = Array.from( dimensions.keys() );
export const createdOn = new Date( '2021-12-24' );
export const testcase1 = TestCase.create( dimensionKeys, ['iPhone 99', 'CTRL'], 'https>//example.com/banner');
export const testcase2 = TestCase.create( dimensionKeys, ['iPhone 99', 'VAR'], 'https>//example.com/banner');
export const campaignMetadata = new CampaignMetadata( [testcase1, testcase2], dimensions, 'test_campaign', createdOn );
