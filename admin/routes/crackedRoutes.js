import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

let accCrackedProcess = null; 
let crackedComboProcess = null; 
let crackedHireProcess = null; 
let crackedProcess = null; 
let productsCrackedProcess = null; 
let serviceCrackedProcess = null;

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

router.post('/acc', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('acc_cracked.py', path.join(__dirname, '../../scrape_cracked/acc_cracked.py'), accCrackedProcess, res, running);
    accCrackedProcess = result.process;
    res.json({ message: result.message });
});


router.post('/combo', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('cracked_combo.py', path.join(__dirname, '../../scrape_cracked/cracked_combo.py'), crackedComboProcess, res, running);
    crackedComboProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for cracked_hire.py
router.post('/hire', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('cracked_hire.py', path.join(__dirname, '../../scrape_cracked/cracked_hire.py'), crackedHireProcess, res, running);
    crackedHireProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for cracked.py
router.post('/source', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('cracked.py', path.join(__dirname, '../../scrape_cracked/cracked.py'), crackedProcess, res, running);
    crackedProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for products_cracked.py
router.post('/products', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('products_cracked.py', path.join(__dirname, '../../scrape_cracked/products_cracked.py'), productsCrackedProcess, res, running);
    productsCrackedProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for service_cracked.py
router.post('/service', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('service_cracked.py', path.join(__dirname, '../../scrape_cracked/service_cracked.py'), serviceCrackedProcess, res, running);
    serviceCrackedProcess = result.process;
    res.json({ message: result.message });
});

export default router;
