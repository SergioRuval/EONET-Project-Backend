// Librería para consumir urls
import fetch from "node-fetch";
import express, { request } from "express";
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
const host = 'localhost';
const port = 8080;

app.listen(port, () => {
    console.log(`Servidor activo en el puerto ${port}`);
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
app.post('/temperatura', async function(req,res){
    let coordenadas= "http://api.weatherstack.com/current?access_key=540219d6872b08bbbdad73466a7cd114&query="+req.body.lat+","+req.body.lon;
    console.log(coordenadas);
    const response = await fetch(coordenadas);
    const data  = await response.json();
    console.log(data)
    res.send(data);
    
});