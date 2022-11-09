// Librería para consumir urls
import fetch from "node-fetch";
import express from "express";
import cors from 'cors';

const app = express();

const host = 'localhost';
const port = 8080;

app.listen(port, () => {
    console.log(`Servidor acttivo en el puerto ${port}`);
});

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.get('/', function (req, res){
    res.send("Página de inicio del sitio");
});

app.get('/events', async function(req, res){
    var response

    if(Object.keys(req.query).length == 0){
        response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events?" + new URLSearchParams({
            status: "open",
            days: 7
        }));
    }else{
        response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events?" + new URLSearchParams(
            req.query
        ));
    }
    const data  = await response.json();
    res.send(data);
});

app.get('/categories', async function(req, res){
    const response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/categories");
    const data  = await response.json();
    res.send(data);
});

app.get('/sources', async function(req, res){
    const response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/sources");
    const data  = await response.json();
    res.send(data);
});

app.get('/layers', async function(req, res){
    const response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/layers");
    const data  = await response.json();
    res.send(data);
});

app.get('/magnitudes', async function(req, res){
    const response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/magnitudes");
    const data  = await response.json();
    res.send(data);
});