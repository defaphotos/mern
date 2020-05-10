const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
const app = express();

conectarDB();

app.use(express.json({ extended: true }));
app.use(cors());
const PORT = process.env.PORT || 4000;

app.use('/api/usuarios',require('./routes/usuarios'))
app.use('/api/auth',require('./routes/auth'));
app.use('/api/proyectos',require('./routes/proyectos'));
app.use('/api/tareas',require('./routes/tareas'));

app.listen(PORT,()=>{
    console.log(`El servidor esta funcionando con el puerto ${PORT}`);
})