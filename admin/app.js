import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import crackedRoutes from './routes/crackedRoutes.js';
import breachedRoutes from './routes/breachedRoutes.js';
import doxbinRoutes from './routes/doxbinRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/cracked', crackedRoutes);
app.use('/breached', breachedRoutes);
app.use('/doxbin', doxbinRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
