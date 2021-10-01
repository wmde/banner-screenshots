#!/usr/bin/env node

import glob from 'glob'
import * as path from 'path';
import * as fs from 'fs';
import meow from "meow";
import MetadataSummarizer from "./src/MetadataSummarizer.js";

const SUMMARY_FILENAME = 'metadata_summary.json';

const cli = meow(
	`
	Usage
		metadata_summary

	Options
		--screenshotPath, -s 	Path to directory containing campaign directories with metadata
		--outputFile, -o		Output file, defaults to '${SUMMARY_FILENAME}' 
	`,
	{
		description: 'Create a summary of test case metadata in campaign directories',
		flags: {
			screenshotPath: {
				alias: 's',
				type: 'string',
				default: 'banner-shots'
			},
			outputFile: {
				alias: 'o',
				type: 'string',
				default: SUMMARY_FILENAME
			}
		}
	} );


const screenshotPath = cli.flags.screenshotPath;

if ( !fs.existsSync( screenshotPath ) ) {
	console.log( `Path "${screenshotPath}" not found!` );
	process.exit( 2 );
}

glob( path.join( screenshotPath, '*', 'metadata.json' ), (err, files) => {
	if ( err ) {
		console.log( err );
		process.exit( 3 );
	}
	// TODO validate metadata
	const metadata = files.map( fn => JSON.parse( fs.readFileSync( fn ) ) );
	const summarizer = new MetadataSummarizer();
	const summary = summarizer.getSummary( metadata );
	fs.writeFileSync(
		path.join( screenshotPath, cli.flags.outputFile ),
		JSON.stringify( summary, null, 4 )
	);
} );

