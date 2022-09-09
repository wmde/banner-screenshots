import fs from 'fs';
import {tmpdir} from "os";
import path from "path";
import {FileMetadataRepository} from "../../src/FileMetadataRepository";
import assert from "assert";
import { campaignMetadata } from "../fixtures/campaign_metadata";

const FIXTURE = path.join( __dirname, '../data/metadata.json' );

describe('FileMetadataRepository', function () {
    describe( '#saveMetadata', () => {
        let testDir : string;

        beforeEach(() => {
            testDir = fs.mkdtempSync(path.join(tmpdir(), 'test-'));
        });
        afterEach(() => { fs.rmSync( testDir, { recursive: true } ); } );

        it('serializes metadata', function () {
            const repo = new FileMetadataRepository(testDir);

            repo.saveMetadata(campaignMetadata);

            const outputFilePath = path.join(testDir, 'test_campaign/metadata.json');
            assert.ok(fs.existsSync(outputFilePath));
            const expectedContent = fs.readFileSync(FIXTURE, 'utf-8');
            const actualContent = fs.readFileSync(outputFilePath, 'utf-8');
			assert.deepEqual(expectedContent, actualContent);
        } );
    } );

    it( 'unserializes metadata', () => {
        const repo = new FileMetadataRepository( path.join( __dirname, '../' ) );

        const unserializedMetadata = repo.loadMetadata( 'data' );

        assert.deepEqual( unserializedMetadata, campaignMetadata );
    } );

    it( 'lists campaigns with metadata files', () => {
        const repo = new FileMetadataRepository( path.join( __dirname, '../data/campaigns' ) );

        assert.deepEqual( repo.getCampaignNames(), [
            '01-desktop',
            '01-mobile',
            '02-desktop',
        ] );
    } );
});
