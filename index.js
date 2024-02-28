require('dotenv').config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

// CONFIGURAÇÃO BANCO
const dbUrl = process.env.DATABASE_URL;
const dbName = "OceanJornadaBackendFev2024";

async function main() {
  const cliente = new MongoClient(dbUrl);
  console.log("Conectando banco de dados...");
  await cliente.connect();
  console.log("Banco de dados conectado com sucesso!");
  const app = express();
  // Sinalisa que o corpo da requisição está em JSON
  app.use(express.json());
  const db = cliente.db(dbName);
  const collection = db.collection('items');

  // const lista = ["Adriano", "Rebeca ", "Júnior"];
  // HOME
  app.get("/", function (req, res) {
    res.send("Hello World Adriano!");
  });

  // BUSCA TODOS
  // app.get("/item", function (req, res) {
  //   res.send(lista);
  // });
  app.get("/item", async function (req, res) {
    const items = await collection.find().toArray();
    res.send(items);
  });

  // BUSCA POR ID
  // app.get("/item/:id", function (req, res) {
  //   const id = req.params.id;
  //   const itemDaLista = lista[id];
  //   res.send(itemDaLista);
  // });
  app.get("/item/:id", async function (req, res) {
    const id = req.params.id;
    const item = await collection.findOne({
      _id: new ObjectId(id)
    })
    res.send(item);
  });

  // CRIAR
  // app.post("/item", function (req, res) {
  //   const body = req.body;
  //   const itemDaLista = body.nome;
  //   lista.push(itemDaLista);
  //   res.send(`Item ${itemDaLista} adicionado com sucesso`);
  //   // res.send(lista)
  // });
  app.post("/item", async function (req, res) {
    const item = req.body;
    await collection.insertOne(item);
    res.send(item);
    // res.send(`Item ${itemDaLista} adicionado com sucesso`);
    // res.send(lista)
  });

  // EDITAR
  app.put('/item/:id', async function(req, res){
    const id = req.params.id
    const novoItem = req.body
    await collection.updateOne(
      {_id: new ObjectId(id)},
      { $set: novoItem }
    )
    res.send('Item atualizado com sucesso');
  })

  // EXCLUIR
  // app.delete('/item/:id', function(req, res){
  //   const body = req.body
  //   const itemNovo = boby.nome
  //   delete lista[id]
  // })
  app.delete('/item/:id', async function(req, res){
    const id = req.params.id;
    await collection.deleteOne({ _id: new ObjectId(id)})
    res.send('Item removido com sucesso')
  })

  app.listen(3000);
}
main();
