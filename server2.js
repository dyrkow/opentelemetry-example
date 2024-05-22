require("./instrumentation")("server2");

const opentelemetry = require("@opentelemetry/api");
const express = require("express");

const app = express();

const tracer = opentelemetry.trace.getTracer("server2", "1.0.0");

app.get("/", (req, res) => {
  const span = tracer.startSpan("main logic");

  console.log("Processing...");
  setTimeout(async () => {
    const response = await fetch("http://server3:3003/");
    const data = await response.text();
    console.log("Finish!");

    span.end();
    res.send(data);
  }, 2000);
});

app.listen(3002, () => console.log("Server #2 listening on port 3002!"));
