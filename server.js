const express = require("express");
const path = require("path");
const app = express();
require('dotenv').config();
const sendToAsana = require("./asana"); 

app.use(express.static(path.join(__dirname, "public")));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(express.json());

app.use((req, res, next) => {     
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");     
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next(); 
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/teste", async (req, res) => {
  console.log("teste");
  res.json({
    mensagem: "Requisição GET recebida com sucesso!",
    status: "ok",
    data: new Date().toISOString(),
  });
});


app.get("/asana", async (req, res) => {
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
