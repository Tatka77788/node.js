require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const morgan = require ('morgan');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const {contactRouter} = require('./contacts/contats.router');


const createServer = async () => {
    try{

const app = express();

await mongoose.connect(process.env.MONGODB_URI,
     {
         useUnifiedTopology: true,
         useNewUrlParser: true,
         useCreateIndex: true
        });
console.log('Database connection successful');

app.all('*', function(req, res, next) {
    const origin = req.get('origin'); 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*')
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors());

app.use(morgan('tiny'));

app.use('/',express.static('public'));

app.use(express.json());

app.use('/contacts', contactRouter);

app.listen(PORT, () => console.log(`Server listening on port: `+ PORT));
} catch (e) {
    console.error(e);
    process.exit(1);
}}

createServer();


