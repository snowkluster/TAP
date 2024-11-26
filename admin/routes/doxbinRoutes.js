import express from 'express';
import { handleScriptExecution }from  '../utils/process.js'
import path from 'path';
import {fileURLToPath} from "url";

const router = express.Router();

let doxbinProcess = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Endpoint for doxbin.py
router.post('/doxbin', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('doxbin.py', path.join(__dirname, '../../functions/scrape_doxbin/doxbin.py'), doxbinProcess, res, running);
    doxbinProcess = result.process;
    res.json({ message: result.message });
});

export default router;
