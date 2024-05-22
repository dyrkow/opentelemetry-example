const express = require("express");

const app = express();

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(3003, () => console.log("Server #3 listening on port 3003!"));