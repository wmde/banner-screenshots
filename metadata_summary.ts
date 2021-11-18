#!/usr/bin/env ts-node-script

import glob from 'tiny-glob'
import * as path from 'path';
import * as fs from 'fs';
import { Command } from 'commander';
import MetadataSummarizer from "./src/MetadataSummarizer";

const SUMMARY_FILENAME = 'metadata_summary.json';

const program = new Command();

program
	.option('-s --screenshotPath <path>', 'Path to directory containing campaign directories with metadata', 'banner-shots')
	.option('-o --outputFile <filename>', 'Output file name', SUMMARY_FILENAME)
	.showHelpAfterError();
program.parse();

const screenshotPath = program.opts().screenshotPath;

if ( !fs.existsSync( screenshotPath ) ) {
	console.log( `Path "${screenshotPath}" not found!` );
	process.exit( 2 );
}

glob( path.join( screenshotPath, '*', 'metadata.json' ) )
	.then( ( files: string[] ) => {
		// TODO validate metadata
		const metadata = files.map( fn => JSON.parse( fs.readFileSync( fn, 'utf-8' ) ) );
		const summarizer = new MetadataSummarizer();
		const summary = summarizer.getSummary( metadata );
		fs.writeFileSync(
			path.join( screenshotPath, program.opts().outputFile ),
			JSON.stringify( summary, null, 4 )
		);
	} )
	.catch( ( err ) => {
		console.log( err );
		process.exit( 3 );
	});

