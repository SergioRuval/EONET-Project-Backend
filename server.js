// Librería para consumir urls
import fetch from "node-fetch";
import express, { request } from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from "mysql"
import { Translate } from "@google-cloud/translate/build/src/v2/index.js";

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

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nef',
    port: 3306
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/', function (req, res){
    res.send("Página de inicio del sitio");
});

app.get('/events', async function(req, res){
    var response

    if(Object.keys(req.query).length == 0){
        response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events?" + new URLSearchParams({
            status: "open",
            // days: 7
            limit: 30
        }));
    }else{
        response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events?" + new URLSearchParams(
            req.query
        ));
    }
    const data  = await response.json();
    data["events"].forEach(evento => {
        buscarEvento(evento);
        console.log("Se busco el evento");
    });
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

app.post('/traducir', async function(req, res){
    var texto = req.body.texto;
    var target = 'es';
    
    const translation = new Translate();
    let [translations] = await translation.translate(texto, target);
    translations = Array.isArray(translations) ? translations : [translations];

    var data = {
        'traduccion': ""
    }

    translations.forEach((translation, i) => {
        data.traduccion += translation
    });

    // console.log(data);
    // const data = translations;
    res.send(data)
});

function insertarEvento(id,title,link,categorie,magnitude,date,coordinates){
    try {
        con.query(`INSERT INTO eventos(id,titulo,link,categoria,magnitud,fecha,coordenadas) 
        VALUES ("${id}","${title}","${link}","${categorie}","${magnitude}","${date}","${coordinates}")`,
        (error,results,fields) =>{
          if(error){
            console.log(error);
          }else{
            if(results.length > 0){
              console.log("insertado");
            }else{
                console.log("no insertado");
            }
          }
        });
          
    } catch (error) {
        console.log(error);
    }
}
function buscarEvento(evento){
    try{
        con.query(`SELECT * FROM eventos where id = "${evento.id}";`,(error,results,fields) =>{
          if(error){
            console.log(error);
          }else{
            if(results.length > 0){
                console.log("Evento encontrado");
            }else{
                console.log("Evento no encontrado");
                let id=evento["id"];
                let title=evento["title"];
                let link=evento["link"];
                let categorie=evento["categories"][0]["title"];
                let magnitude=evento["geometry"][0]["magnitudValue"]+evento["geometry"][0]["magnitudUnit"];
                let date=evento["geometry"][0]["date"];
                let coordinates=evento["geometry"][0]["coordinates"][0]+", "+evento["geometry"][0]["coordinates"][1];
                insertarEvento(id,title,link,categorie,magnitude,date,coordinates);
            }
          }
        });
    }catch (error) {
    console.log(error);
    }
}