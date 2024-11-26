import express from 'express';
import { handleScriptExecution }from  '../utils/process.js'
import path from 'path';
import {fileURLToPath} from "url";

const router = express.Router();

let onniDbsProcess = null;
let onniHackProcess = null;
let onniOpsecProcess = null;
let onniOtherProcess = null;
let onniPremProcess = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Endpoint for onni_dbs.py
router.post('/dbs', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('onni_dbs.py', path.join(__dirname, '../../functions/scrape_onniforums/onni_dbs.py'), onniDbsProcess, res, running);
    onniDbsProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for onni_hack.py
router.post('/hack', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('onni_hack.py', path.join(__dirname, '../../functions/scrape_onniforums/onni_hack.py'), onniHackProcess, res, running);
    onniHackProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for onni_opsec.py
router.post('/opsec', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('onni_opsec.py', path.join(__dirname, '../../functions/scrape_onniforums/onni_opsec.py'), onniOpsecProcess, res, running);
    onniOpsecProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for onni_other.py
router.post('/other', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('onni_other.py', path.join(__dirname, '../../functions/scrape_onniforums/onni_other.py'), onniOtherProcess, res, running);
    onniOtherProcess = result.process;
    res.json({ message: result.message });
});

// Endpoint for onni_prem.py
router.post('/prem', (req, res) => {
    const { running } = req.body;
    const result = handleScriptExecution('onni_prem.py', path.join(__dirname, '../../functions/scrape_onniforums/onni_prem.py'), onniPremProcess, res, running);
    onniPremProcess = result.process;
    res.json({ message: result.message });
});

export default router;
