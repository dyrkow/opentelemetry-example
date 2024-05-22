const express = require("express");

const app = express();

app.get("/", (req, res) => {
  console.log("Processing...");
  setTimeout(() => {
    console.log("Finish!");
    res.send("Hello World!");
  }, 3000);
});

app.listen(3003, () => console.log("Server #3 listening on port 3003!"));
