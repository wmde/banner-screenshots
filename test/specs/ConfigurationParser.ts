import { strict as assert } from 'assert';
import * as fs from 'fs';
import {ConfigurationParser} from '../../src/ConfigurationParser';
import { TestCaseGenerator } from "../../src/Model/TestCaseGenerator";

const CAMPAIGN = 'desktop';
const VALID_TOML = '/../data/valid.toml';
const MISSING_BANNERS_TOML = '/../data/missing_banners.toml';
const MISSING_PREVIEW_URL_TOML = '/../data/missing_preview_url.toml';
const MISSING_TEST_MATRIX_TOML = '/../data/missing_test_matrix.toml';

describe('ConfigurationParser', () => {

	it('throws exception on toml parse error', () => {
		assert.throws( () => {
			new ConfigurationParser( "I am invalid toml" );
		}, Error );
	});


	it('throws exception on missing preview_url', () => {
		let config = fs.readFileSync( __dirname + MISSING_PREVIEW_URL_TOML, 'utf-8' );

		assert.throws( () => {
			let configParser = new ConfigurationParser( config );
			configParser.generate( CAMPAIGN );
		}, Error );
	});


	it('throws exception on missing banners', () => {
		let config = fs.readFileSync( __dirname + MISSING_BANNERS_TOML, 'utf-8');

		assert.throws( () => {
			let configParser = new ConfigurationParser( config );
			configParser.generate( CAMPAIGN );
		}, Error );
	});


	it('throws exception on missing test_matrix', () => {
		let config = fs.readFileSync( __dirname + MISSING_TEST_MATRIX_TOML, 'utf-8');

		assert.throws( () => {
			let configParser = new ConfigurationParser( config );
			configParser.generate( CAMPAIGN );
		}, Error );
	});


	it('generates matrix data', () => {
		const config = fs.readFileSync( __dirname + VALID_TOML, 'utf-8');

		let configParser = new ConfigurationParser( config );
		let matrix = configParser.generate( CAMPAIGN );

		assert.ok( matrix instanceof TestCaseGenerator, "object should be Instance of TestCaseGenerator" );
	});
});
