/**
 * Interface for finding and retrieving the contents of campaign_config.toml
 */
export interface ConfigReader {
	getConfig(): Promise<string>;
}
