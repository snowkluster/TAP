import {fileURLToPath} from "url";
import path from "path";
import {spawn} from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleScriptExecution = (scriptName, scriptPath, processVariable, res, running) => {
    const pythonPath = path.join(__dirname, '../../../env/bin/python'); // Adjust this if needed

    if (running && !processVariable) {
        processVariable = spawn(pythonPath, [scriptPath], {
            cwd: path.dirname(scriptPath),
        });

        processVariable.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        processVariable.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        processVariable.on('exit', () => {
            processVariable = null;
        });

        return { process: processVariable, message: `${scriptName} script started!` };
    } else if (!running && processVariable) {
        processVariable.kill();
        processVariable = null;
        return { process: null, message: `${scriptName} script stopped!` };
    } else if (running && processVariable) {
        return { process: processVariable, message: `${scriptName} script is already running.` };
    } else {
        return { process: null, message: `${scriptName} script is already stopped.` };
    }
};