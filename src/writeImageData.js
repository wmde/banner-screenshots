import { promises as fs } from 'fs'

export function writeImageData( imageData, filename ) {
	const buff = Buffer.from( imageData, 'base64')
	return fs.writeFile( filename, buff );
}
