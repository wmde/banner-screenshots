import { remote, multiremote } from 'webdriverio';

export const DEFAULT_CONNECTION_PARAMS = {
	user: '',
	key: '',
	services: [
		['testingbot', {
			tbTunnel: false
		}]
	],
	// Set to "info" or trace to see everything the library is doing
	logLevel: "warn",
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
		if (!this.connectionOptions.user || !this.connectionOptions.key ) {
			throw new Error( 'user and key must not be empty' );
		}
		return remote( browserOptions );
	}

	async getBrowsers( testCases ) {
		const connectionOptions = this.connectionOptions;
		const capabilityFactory = this.capabilityFactory;
		const capabilityObject = testCases.reduce(
			( capabilityMap, testCase ) => {
				capabilityMap[ testCase.getName() ] = {
					...connectionOptions,
					capabilities: capabilityFactory.getCapabilities(testCase)
				};
				return capabilityMap;
			},
			{}
		);

		return multiremote( capabilityObject );
	}

}
