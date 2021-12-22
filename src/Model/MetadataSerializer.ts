import CampaignMetadata from "./CampaignMetadata";
import {Dimension, Dimensions} from "./Dimension";
import {SerializedTestCase, serializeTestCase, unserializeTestCase} from "./TestCaseSerializer";

export type DimensionEntries = Array<[string, string[]]>;

export interface SerializedCampaignMetadata {
    createdOn: string;
    campaign: string;
    dimensions: DimensionEntries,
    testCases: SerializedTestCase[]
}

function isSerializedCampaignMetadata( data: any ): data is SerializedCampaignMetadata {
    return typeof data === 'object' &&
        data.createdOn &&
        !isNaN( Date.parse( data.createdOn ) ) &&
        data.dimensions &&
        data.dimensions.reduce( (acc: boolean, [dimensionKey]) => acc && isDimensionValue( dimensionKey ), true ) &&
        data.testCases
}

function isDimensionValue( dimensionCandidate: any ): dimensionCandidate is keyof typeof Dimension {
    return Dimension[dimensionCandidate.toUpperCase() as keyof typeof Dimension] !== undefined;
}

export function serializeDimensionsToEntries( dimensions: Dimensions ): DimensionEntries {
    const result: DimensionEntries = [];
    for( const [dimension, values] of dimensions.entries() ) {
        result.push( [ String(dimension), values ] );
    }
    return result;
}

export function unserializeDimension( dimensionName: any ): Dimension {
    if (!isDimensionValue( dimensionName ) ) {
        throw new Error( `"${dimensionName}" is not a valid dimension name` );
    }
    return Dimension[dimensionName.toUpperCase() as keyof typeof Dimension]
}

export function unserializeEntriesToDimensions( entries: DimensionEntries ): Dimensions {
    return new Map(
        entries.map(
            ([dimensionName, values]) => [ unserializeDimension( dimensionName ), values ]
        )
    );
}

export function serializeCampaignMetadata( metadata: CampaignMetadata ): SerializedCampaignMetadata {
    return {
        createdOn: metadata.createdOn.toISOString(),
        campaign: metadata.campaign,
        dimensions: serializeDimensionsToEntries( metadata.dimensions ),
        testCases: metadata.getTestCases().map( serializeTestCase )
    }
}

export function unserializeCampaignMetadata( data: any ): CampaignMetadata {
    if ( !isSerializedCampaignMetadata( data ) ) {
        throw new Error( 'Data is is not serialized Metadata' );
    }
    const createdOn = new Date(data.createdOn);
    const dimensions = unserializeEntriesToDimensions( data.dimensions );
    const testCases = data.testCases.map( tc => unserializeTestCase( tc ) );
    return new CampaignMetadata( testCases, dimensions, data.campaign, createdOn );
}
