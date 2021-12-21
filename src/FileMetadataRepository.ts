import {CampaignMetadataRepository} from "./Model/CampaignMetadataRepository";
import fs from "fs";
import path from 'path';
import {serializeCampaignMetadata, unserializeCampaignMetadata} from "./Model/MetadataSerializer";
import CampaignMetadata from "./Model/CampaignMetadata";

export class FileMetadataRepository implements CampaignMetadataRepository {
    private readonly campaignPath: string;

    constructor(campaignPath: string) {
        this.campaignPath = campaignPath;
    }

    loadMetadata( campaignName: string ): CampaignMetadata {
        const metadataStr = fs.readFileSync( this.getFilename( campaignName ), 'utf-8' );
        return unserializeCampaignMetadata( JSON.parse( metadataStr ) );
    }

    saveMetadata(metadata: CampaignMetadata): void {
        const fileName = this.getFilename( metadata.campaign );
        const dirName = path.dirname( fileName );
        if (!fs.existsSync( dirName ) ) {
            fs.mkdirSync( dirName, { recursive: true } );
        }

        const metadataStr = JSON.stringify( serializeCampaignMetadata( metadata ), null, 2 );
        fs.writeFileSync( fileName, metadataStr, 'utf-8' );
    }

    private getFilename( campaignName: string ): string {
        return path.join( this.campaignPath, campaignName, 'metadata.json' );
    }
}
