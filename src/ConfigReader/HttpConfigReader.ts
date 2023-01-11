import * as http from 'http'
import * as https from 'https'
import { urlJoin } from 'url-join-ts';
import { ConfigReader } from './ConfigReaderInterface';

export class HttpConfigReader implements ConfigReader {
	baseUrl: string;
	remoteBranchName: string;

	constructor( baseUrl: string, remoteBranchName: string ) {
		this.baseUrl = baseUrl;
		this.remoteBranchName = remoteBranchName;
	}

	getConfig(): Promise<string> {

		const url = urlJoin( this.baseUrl, this.remoteBranchName, 'campaign_info.toml' );
		return this.doRequest( url );
		
	}

	private doRequest( url: string ): Promise<string> {
		return new Promise( ( resolve, reject ) => {
			// Determine which module to use. They have the same API
			const httpModule = /^https:/.test(url) ? https : http;
			console.log(`Fetching ${url}`);
			const req = httpModule.get( url, (res) => {
				const { statusCode } = res;

				if (res.statusCode == 302 || res.statusCode == 301 ) {
					this.doRequest( res.headers.location ).then( content => resolve( content ) )
		        }

				  if (statusCode !== 200) {
					reject(`Could not read ${url}.\nStatus Code: ${statusCode}`);
				  }

				  const rawData = [];
				  res.on('data', (chunk) => { rawData.push( chunk ); });

				  res.on('end', () => {
					  resolve( Buffer.concat( rawData ).toString() )
				} );
			} );

			req.on('error', (e) => reject(e));
		} );
	}

}
