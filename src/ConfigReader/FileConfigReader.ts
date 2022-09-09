import { readFile } from 'fs/promises';
import { ConfigReader } from './ConfigReaderInterface';

export class FileConfigReader implements ConfigReader {
	configPath: string;

	constructor( configPath: string ) {
		this.configPath = configPath;
	}

	getConfig(): Promise<string> {
		return readFile( this.configPath, 'utf-8')		
	}
}
