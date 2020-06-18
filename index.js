const express = require("express");
const cors = require("cors");
const { ExpressPeerServer } = require("peer");

const app = express();

const server = app.listen(process.env.PORT);

let host = null;

let connections = [];
const peerServer = ExpressPeerServer(server);

peerServer.on("connection", ({ id }) => {
  if (!host) {
    host = id;
  }

  connections = [...connections, id];
});

peerServer.on("disconnect", ({ id }) => {
  if (connections.length > 1) {
    connections = connections.filter((id) => connections.indexOf(id) !== 1);
    if (host === id) {
      host = connections[0];
    }
  } else if (!connections.length) {
    host = null;
    connections = [];
  }
});

app.use(cors());
app.use("/", peerServer);

app.get("/peerjs/host", (req, res) => {
  res.status(200).send({ host, connections });
});
