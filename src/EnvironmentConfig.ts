import dotenv from 'dotenv';

export default class EnvironmentConfig {
    public readonly queueUrl: string;
    public readonly testingBotApiKey: string;
    public readonly testingBotApiSecret: string;

    private constructor( queueUrl: string, testingBotApiKey: string, testingBotApiSecret: string ) {
        this.queueUrl = queueUrl;
        this.testingBotApiKey = testingBotApiKey;
        this.testingBotApiSecret = testingBotApiSecret;
    }

    public static create(): EnvironmentConfig {
        dotenv.config();
        return new EnvironmentConfig(
            EnvironmentConfig.getStringValue('QUEUE_URL'),
            EnvironmentConfig.getStringValue('TB_KEY'),
            EnvironmentConfig.getStringValue('TB_SECRET'),
        );
    }

    private static getStringValue(name: string): string {
        const value = process.env[name] ?? '';
        if (!value) {
            throw new Error( `Configuration value ${name} not found in .env file or environment variables.` );
        }
        return value;
    }
}
