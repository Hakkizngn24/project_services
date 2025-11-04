import express from 'express';
import cors from 'cors';
import projectRoutes from './routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res) => {
    res.send('Project services çalışıyor !!');
});

app.use('/api/projects', projectRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Bir şeyler ters gitti!');
});

export default app;