import express from 'express';
import { spawn } from 'child_process';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Separate process variables for each script
let accCrackedProcess = null; 
let crackedComboProcess = null; 
let otherOnniProcess = null; 
let dbsOnniProcess = null; 

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Set the views directory to 'pages'
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index'); // Adjust as necessary
});

// Helper function to handle script execution
const handleScriptExecution = (scriptName, scriptPath, processVariable, res) => {
    const { running } = req.body;
    const pythonPath = path.join(__dirname, '../env/bin/python'); // Update for Windows if necessary

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
            processVariable = null; // Clear process reference when it exits
        });

        return res.json({ message: `${scriptName} script started!` });
    } else if (!running && processVariable) {
        processVariable.kill();
        processVariable = null;
        return res.json({ message: `${scriptName} script stopped!` });
    } else {
        return res.json({ message: `${scriptName} script is already in the desired state.` });
    }
};

// Endpoint for acc_cracked.py
app.post('/cracked/acc', (req, res) => {
    handleScriptExecution('acc_cracked.py', path.join(__dirname, '../scrape_cracked/acc_cracked.py'), accCrackedProcess, res);
});

// Endpoint for cracked_combo.py
app.post('/cracked/combo', (req, res) => {
    handleScriptExecution('cracked_combo.py', path.join(__dirname, '../scrape_cracked/cracked_combo.py'), crackedComboProcess, res);
});

// Endpoint for cracked_hire.py
app.post('/cracked/hire', (req, res) => {
    handleScriptExecution('cracked_hire.py', path.join(__dirname, '../scrape_cracked/cracked_hire.py'), otherOnniProcess, res);
});

// Endpoint for cracked.py
app.post('/cracked/source', (req, res) => {
    handleScriptExecution('cracked.py', path.join(__dirname, '../scrape_cracked/cracked.py'), dbsOnniProcess, res);
});

// Endpoint for products_cracked.py
app.post('/cracked/products', (req, res) => {
    handleScriptExecution('products_cracked.py', path.join(__dirname, '../scrape_cracked/products_cracked.py'), dbsOnniProcess, res);
});

// Endpoint for service_cracked.py
app.post('/cracked/service', (req, res) => {
    handleScriptExecution('service_cracked.py', path.join(__dirname, '../scrape_cracked/service_cracked.py'), dbsOnniProcess, res);
});

// Endpoint for profile_cracked.py
app.post('/cracked/profiles', (req, res) => {
    handleScriptExecution('profile_cracked.py', path.join(__dirname, '../scrape_cracked/profile_cracked.py'), dbsOnniProcess, res);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
