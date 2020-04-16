const assert = require('assert');
const fs = require('fs');
import {ConfigurationParser} from '../../src/ConfigurationParser';
import { TestCaseGenerator } from "../../src/TestCaseGenerator";

const CAMPAIGN = 'desktop';
const VALID_TOML = '/../data/valid.toml';
const MISSING_BANNERS_TOML = '/../data/missing_banners.toml';
const MISSING_PREVIEW_URL_TOML = '/../data/missing_preview_url.toml';
const MISSING_TEST_MATRIX_TOML = '/../data/missing_test_matrix.toml';

describe('CampaignScreenshotGenerator', () => {

	it('throws exception on toml parse error', () => {
		assert.throws( () => {
			let generator = new ConfigurationParser( "I am invalid toml" );
		}, Error );
	});


	it('throws exception on missing preview_url', () => {
		let config = fs.readFileSync( __dirname + MISSING_PREVIEW_URL_TOML );

		assert.throws( () => {
			let generator = new ConfigurationParser( config );
			generator.generate( CAMPAIGN );
		}, Error );
	});


	it('throws exception on missing banners', () => {
		let config = fs.readFileSync( __dirname + MISSING_BANNERS_TOML );

		assert.throws( () => {
			let generator = new ConfigurationParser( config );
			generator.generate( CAMPAIGN );
		}, Error );
	});


	it('throws exception on missing test_matrix', () => {
		let config = fs.readFileSync( __dirname + MISSING_TEST_MATRIX_TOML );

		assert.throws( () => {
			let generator = new ConfigurationParser( config );
			generator.generate( CAMPAIGN );
		}, Error );
	});


	it('loads toml into data object', () => {
		const config = fs.readFileSync( __dirname + VALID_TOML );

		let generator = new ConfigurationParser( config );
		assert.notEqual( typeof generator.data, undefined );
	});


	it('generates matrix data', () => {
		const config = fs.readFileSync( __dirname + VALID_TOML );

		let generator = new ConfigurationParser( config );
		let matrix = generator.generate( CAMPAIGN );

		assert.ok( matrix instanceof TestCaseGenerator, "object should be Instance of TestMatrix" );
	});
});