const express = require("express");
const path = require("path");
const app = express();
require('dotenv').config();
const sendToAsana = require("./asana"); 

const cors = require("cors");
app.use(cors());


app.use(express.static(path.join(__dirname, "public")));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(express.json());

app.get('/', (req, res) => {
  res.setHeader("Content-Type", "text/html");

  res.setHeader("Access-Control-Allow-Origin", "*"); 
});

app.get("/teste", async (req, res) => {
  res.json({
    mensagem: "Requisição GET recebida com sucesso!",
    status: "ok",
    data: new Date().toISOString(),
  });
});


app.post("/asana", async (req, res) => {
  try {
    const resultado = await sendToAsana(req.body);
    res.json(resultado);  
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar tarefa no Asana." });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
