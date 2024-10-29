import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

let doxbinProcess = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handleScriptExecution = (scriptName, scriptPath, processVariable, res, running) => {
    const pythonPath = path.join(__dirname, '../../env/bin/python');

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

// Endpoint for doxbin.py
router.post('/doxbin', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('doxbin.py', path.join(__dirname, '../../functions/scrape_doxbin/doxbin.py'), doxbinProcess, res, running);
    doxbinProcess = result.process;
    res.json({ message: result.message });
});

export default router;
