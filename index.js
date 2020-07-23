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

app.use(cors());

app.use(morgan('tiny'));

app.use('/',express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use('/contacts', contactRouter);

app.listen(PORT, () => console.log(`Server listening on port: `+ PORT));
} catch (e) {
    console.error(e);
    process.exit(1);
}}

createServer();


