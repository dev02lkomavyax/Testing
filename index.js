import express from 'express'
import Connection from './Database/db.js';
import router from './Routes/routes.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import cors from 'cors';
const app = express()
const Port= 8000;

app.use(express.json())
app.use(cookieParser());
app.use(cors());

app.use(bodyParser.json());
app.use('/', router);
Connection();
app.listen(Port,()=>{
    console.log(`Server is running at ${Port}`)
})

 