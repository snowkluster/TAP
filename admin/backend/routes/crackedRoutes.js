import express from 'express';
import { handleScriptExecution }from  '../utils/process.js'
import path from 'path';
import {fileURLToPath} from "url";

const router = express.Router();

let accCrackedProcess = null; 
let crackedComboProcess = null; 
let crackedHireProcess = null; 
let crackedProcess = null; 
let productsCrackedProcess = null; 
let serviceCrackedProcess = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/acc', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('acc_cracked.py', path.join(__dirname, '../../../functions/scrape_cracked/acc_cracked.py'), accCrackedProcess, res, running);
    accCrackedProcess = result.process;
    res.json({ message: result.message });
});


router.post('/combo', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('cracked_combo.py', path.join(__dirname, '../../../functions/scrape_cracked/cracked_combo.py'), crackedComboProcess, res, running);
    crackedComboProcess = result.process;
    res.json({ message: result.message });
});

router.post('/hire', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('cracked_hire.py', path.join(__dirname, '../../../functions/scrape_cracked/cracked_hire.py'), crackedHireProcess, res, running);
    crackedHireProcess = result.process;
    res.json({ message: result.message });
});

router.post('/source', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('cracked.py', path.join(__dirname, '../../../functions/scrape_cracked/cracked.py'), crackedProcess, res, running);
    crackedProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for products_cracked.py
router.post('/products', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('products_cracked.py', path.join(__dirname, '../../../functions/scrape_cracked/products_cracked.py'), productsCrackedProcess, res, running);
    productsCrackedProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for service_cracked.py
router.post('/service', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('service_cracked.py', path.join(__dirname, '../../../functions/scrape_cracked/service_cracked.py'), serviceCrackedProcess, res, running);
    serviceCrackedProcess = result.process;
    res.json({ message: result.message });
});

export default router;
