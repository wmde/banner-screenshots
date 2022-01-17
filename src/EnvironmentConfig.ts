import dotenv from 'dotenv';

export default class EnvironmentConfig {

    constructor() {
        dotenv.config();
    }

    get queueUrl(): string {
        return EnvironmentConfig.getStringValue('QUEUE_URL' );
    }
    get testingBotApiKey(): string {
        return EnvironmentConfig.getStringValue('TB_KEY' );
    }
    get testingBotApiSecret(): string {
        return EnvironmentConfig.getStringValue('TB_SECRET' );
    }

    private static getStringValue(name: string): string {
        const value = process.env[name] ?? '';
        if (!value) {
            throw new Error( `Configuration value ${name} not found in .env file or environment variables.` );
        }
        return value;
    }
}
