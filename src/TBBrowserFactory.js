const { remote } = require('webdriverio');

export const CONNECTION = {
	user: process.env.TB_KEY,
	key: process.env.TB_SECRET,
	services: [
		['testingbot', {
			tbTunnel: false
		}]
	],
	logLevel: "trace",
	connectionRetryCount: 1
}

export const factoryOptions = {
	'tb:options': { screenrecorder: false }
}

export class BrowserFactory {
	/**
	 *
	 * @param {object} connectionOptions
	 * @param {CapabilityFactory} capabilityFactory
	 */
	constructor( connectionOptions, capabilityFactory ) {
		this.connectionOptions = connectionOptions;
		this.capabilityFactory = capabilityFactory;
	}

	async getBrowser( testCase ) {
		const browserOptions = Object.assign(
			this.connectionOptions,
			{ capabilities: this.capabilityFactory.getCapabilities( testCase )}
		);
		return remote( browserOptions );
	}
}