const express = require("express");
const { ExpressPeerServer } = require("peer");

const app = express();

const server = app.listen(process.env.PORT);

app.get("/", (req, res) => {
  res.sendStatus(200);
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

peerServer.on("connection", console.log);
peerServer.on("disconnect", console.log);

app.use("/peerjs", peerServer);
