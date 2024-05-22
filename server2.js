const express = require("express");

const app = express();

app.get("/", (req, res) => {
  console.log("Processing...");
  setTimeout(async () => {
    const response = await fetch("http://localhost:3003/");
    const data = await response.text();
    console.log("Finish!");
    res.send(data);
  }, 2000);
});

app.listen(3002, () => console.log("Server #2 listening on port 3002!"));
