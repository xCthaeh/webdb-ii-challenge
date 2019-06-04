const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const knexConfig = require("./knexfile.js");
const db = knex(knexConfig.development);
const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
server.get("/", (req, res) => {
  res.json({ api: "running" });
});

server.get("/api/zoos", (req, res) => {
  db("zoos")
    .then(zoos => res.status(200).json(zoos))
    .catch(err => res.status(500).json({ error: err }));
});

server.get("/api/zoos/:id", (req, res) => {
  const zooId = req.params.id;
  db("zoos")
    .where({ id: zooId })
    .then(zooInfo => res.status(200).json(zooInfo))
    .catch(err => res.status(500).json({ error: err }));
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
