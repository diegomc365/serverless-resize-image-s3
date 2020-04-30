'use strict';

const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const {resizeUpload} = require('./resizeUpload')

// Cors
app.use(cors());

// Data Parsing
app.use(bodyParser.json({ extended: true })); 
app.use(bodyParser.urlencoded({extended: true}));

// here you send the URL image 
app.post('/resize', async (req, res, cb) => {

    let path = req.body.path; // URL Image
    let route = 'test'

    const responseResize = await resizeUpload(path, route);

    let response = {
        message: 'Image was successfully reduced and uploaded to S3',
        resultado: responseResize
    }

    res.status(200).json(response);
})

module.exports.app = serverless(app);