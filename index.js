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

server.put("/api/zoos/:id", (req, res) => {
  const changes = req.body;
  const zooId = req.params.id;
  db("zoos")
    .where({ id: zooId })
    .update(changes)
    .then(count => {
      if (count) {
        res.status(200).json({ count });
      } else {
        res.status(404).json({ error: "No Zoo with this ID could be found" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

server.post("/api/zoos", (req, res) => {
  const zoo = req.body;
  if (zoo.name) {
    db("zoos")
      .insert(zoo)
      .then(ids => {
        res.status(201).json(ids);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  } else {
    res.status(400).json({ error: "Zoo name was not valid" });
  }
});

server.delete("/api/zoos/:id", (req, res) => {
  const zooId = req.params.id;
  db("zoos")
    .where({ id: zooId })
    .del()
    .then(count => {
      if (count) {
        res.status(200).json({ count });
      } else {
        res.status(404).json({ error: "No Zoo with this ID could be found." });
      }
    })
    .catch(err => res.status(500).json({ error: err }));
});

//Stretch "Bears" end-points

server.get("/api/bears", (req, res) => {
  db("bears")
    .then(bears => res.status(200).json(bears))
    .catch(err => res.status(500).json({ error: err }));
});

server.get("/api/bears/:id", (req, res) => {
  const bearId = req.params.id;
  db("bears")
    .where({ id: bearId })
    .then(bearInfo => res.status(200).json(bearInfo))
    .catch(err => res.status(500).json({ error: err }));
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
