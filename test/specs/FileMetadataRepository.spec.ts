import fs from 'fs';
import {tmpdir} from "os";
import path from "path";
import {FileMetadataRepository} from "../../src/FileMetadataRepository";
import assert from "assert";
import { campaignMetadata } from "../fixtures/campaign_metadata";

const FIXTURE = path.join( __dirname, '../data/metadata.json' );

describe('FileMetadataRepository', function () {
    let testDir;
    beforeEach(() => { testDir = fs.mkdtempSync( path.join( tmpdir(), 'test-') ); } );
    //afterEach(() => { fs.rmSync( testDir, { recursive: true } ); } );

    it('serializes metadata', function() {
        const repo = new FileMetadataRepository( testDir );

        repo.saveMetadata( campaignMetadata );

        const outputFilePath = path.join( testDir, 'test_campaign/metadata.json' );
        assert.ok( fs.existsSync( outputFilePath ) );
        const expectedContent = fs.readFileSync( FIXTURE );
        const actualContent = fs.readFileSync( outputFilePath );
        assert.ok( expectedContent.equals( actualContent ) );
    } );

    it( 'unserializes metadata', () => {
        const repo = new FileMetadataRepository( path.join( __dirname, '../' ) );

        const unserializedMetadata = repo.loadMetadata( 'data' );

        assert.deepEqual( unserializedMetadata, campaignMetadata );
    })
});
