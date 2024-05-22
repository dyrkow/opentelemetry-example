require("./instrumentation")("server3");

const opentelemetry = require("@opentelemetry/api");
const express = require("express");

const app = express();

const tracer = opentelemetry.trace.getTracer("server3", "1.0.0");

app.get("/", (req, res) => {
  const span = tracer.startSpan("main logic");

  console.log("Processing...");
  setTimeout(() => {
    console.log("Finish!");
    span.end();
    res.send("Hello World!");
  }, 3000);
});

app.listen(3003, () => console.log("Server #3 listening on port 3003!"));
