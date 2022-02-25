const express = require('express');
const container = require('./utils/Container');
const PORT = 8080;
const FILE_PATH = 'Products.txt';

const app = express();
const cont = new container(FILE_PATH);

const randomSeed = (min, max) => Math.floor((Math.random() * (max-min)) + min);

const server = app.listen(8080, ()=>{
    console.log(`Listen for port: ${server.address().port}`);
})

server.on("error", error => console.log(`Error en el servidor ${error}`));

app.get('/products', async (req, res) => {
        let body = await cont.getAll();
        res.send(body);    
})

app.get('/ramdomProduct', async (req, res) => {
    let ramdom = randomSeed(1,4);
    let body = await cont.getById(ramdom);
    res.send(body);
})