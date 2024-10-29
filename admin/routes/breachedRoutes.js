import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

let crackedAccProcess = null; 
let databasesProcess = null; 
let otherLeaksProcess = null; 
let stealerProcess = null; 

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handleScriptExecution = (scriptName, scriptPath, processVariable, res, running) => {
    const pythonPath = path.join(__dirname, '../../env/bin/python'); // Adjust this if needed

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

// Endpoint for cracked_acc.py
router.post('/cracked-acc', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('cracked_acc.py', path.join(__dirname, '../../functions/scrape_breachforums/cracked_acc.py'), crackedAccProcess, res, running);
    crackedAccProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for databases.py
router.post('/databases', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('databases.py', path.join(__dirname, '../../functions/scrape_breachforums/databases.py'), databasesProcess, res, running);
    databasesProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for other_leaks.py
router.post('/other-leaks', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('other_leaks.py', path.join(__dirname, '../../functions/scrape_breachforums/other_leaks.py'), otherLeaksProcess, res, running);
    otherLeaksProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for stealer.py
router.post('/stealer', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('stealer.py', path.join(__dirname, '../../functions/scrape_breachforums/stealer.py'), stealerProcess, res, running);
    stealerProcess = result.process;
    res.json({ message: result.message });
});

export default router;
