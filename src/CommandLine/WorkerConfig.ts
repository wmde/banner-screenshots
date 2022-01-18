import {Command} from "commander";
import path from "path";

interface WorkerConfig {
    verbose: boolean;
    outputPath: string
}

export class WorkerConfigFactory {
    
    public getConfig( workerDescription: string, cwd: string ): WorkerConfig {
        const program = new Command();
        program.description( workerDescription );
        program.option('-s --screenshotPath <path>', 'Path to directory containing campaign directories with metadata', 'banner-shots')
        program.option('-v --verbose', 'Show output');
        program.showHelpAfterError();
        program.parse();

        const options = program.opts();
        const verbose = options.verbose;
        const outputPath = path.isAbsolute( options.screenshotPath ) ? options.screenshotPath : path.join( process.cwd(), options.screenshotPath );
        return { verbose, outputPath }
    }
}