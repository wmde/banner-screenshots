const { remote } = require('webdriverio');

export const CONNECTION = {
	protocol: 'https',
	host: 'ondemand.saucelabs.com',
	port: 443,
	path:'/wd/hub',
	user: process.env.SAUCE_USERNAME,
	key: process.env.SAUCE_KEY,
	"sauce:options": {
		"recordVideo": false,
		"screenResolution": "1280x800"
	}
};

export const factoryOptions = {}

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
			{ capabilities: this.capabilityFactory.getCapabilities( testCase ) }
		);
		return remote( browserOptions );
	}
}