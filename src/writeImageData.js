import { promises as fs } from 'fs'
import path from 'path'

async function writeImageData( imageData, filename ) {
	const buff = Buffer.from( imageData, 'base64')
	return fs.writeFile( filename, buff );
}

export async function createImageWriter( directory ) {
	await fs.mkdir( directory, { recursive: true } );
	return function( imageData, filename ) {
		console.log(`writing image data to ${path.join( directory, filename )} `)
		return writeImageData( imageData, path.join( directory, filename ) )
	}
}
