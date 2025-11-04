import 'dotenv/config';
import app from './src/app.js';
import {sequelize} from './src/models/index.js';

const PORT = process.env.PORT || 3001;

const startServer = async () => {
        try {
            await sequelize.authenticate()

            app.listen(PORT,()=> {
                console.log(`Project Service http://localhost:${PORT} adresinde çalışıyor`)});
        } catch (err) {
            console.error('Server başlatılamadı !!')
        }
}

startServer()