import express from 'express';
import { handleScriptExecution }from  '../utils/process.js'
import path from 'path';
import {fileURLToPath} from "url";

const router = express.Router();

let nulledAccProcess = null;
let nulledComboProcess = null;
let nulledDbsProcess = null;
let nulledProdsProcess = null;
let nulledSourceProcess = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Endpoint for nulled_acc.py
router.post('/acc', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('nulled_acc.py', path.join(__dirname, '../../../functions/scrape_nulled/nulled_acc.py'), nulledAccProcess, res, running);
    nulledAccProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for nulled_combo.py
router.post('/combo', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('nulled_combo.py', path.join(__dirname, '../../../functions/scrape_nulled/nulled_combo.py'), nulledComboProcess, res, running);
    nulledComboProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for nulled_dbs.py
router.post('/dbs', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('nulled_dbs.py', path.join(__dirname, '../../../functions/scrape_nulled/nulled_dbs.py'), nulledDbsProcess, res, running);
    nulledDbsProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for nulled_prods.py
router.post('/prods', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('nulled_prods.py', path.join(__dirname, '../../../functions/scrape_nulled/nulled_prods.py'), nulledProdsProcess, res, running);
    nulledProdsProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for nulled_source.py
router.post('/source', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('nulled_source.py', path.join(__dirname, '../../../functions/scrape_nulled/nulled_source.py'), nulledSourceProcess, res, running);
    nulledSourceProcess = result.process;
    res.json({ message: result.message });
});

export default router;
