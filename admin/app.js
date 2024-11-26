import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import crackedRoutes from './routes/crackedRoutes.js';
import breachedRoutes from './routes/breachedRoutes.js';
import doxbinRoutes from './routes/doxbinRoutes.js';
import nulledRoutes from './routes/nulledRoutes.js';
import onniRoutes from './routes/onniRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

// app.use((req, res, next) => {
//     if (req.headers.host !== 'dashboard.localhost') {
//       return res.status(403).send('Forbidden');
//     }
//     next();
// });

app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/cracked', crackedRoutes);
app.use('/breached', breachedRoutes);
app.use('/doxbin', doxbinRoutes);
app.use('/nulled', nulledRoutes);
app.use('/onni', onniRoutes);

app.listen(PORT,'127.0.0.1', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
