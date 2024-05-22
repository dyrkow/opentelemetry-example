require('./instrumentation')('server1');

const express = require("express");

const app = express();

app.get("/", async (req, res) => {
  console.log('Processing...');
  const response = await fetch("http://server2:3002/");
  const data = await response.text();
  console.log('Finish!', data);
  res.send(data);
});

app.listen(3001, () => console.log("Server #1 listening on port 3001!"));
