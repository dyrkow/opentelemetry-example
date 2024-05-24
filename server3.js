require("./instrumentation")("server3");

const opentelemetry = require("@opentelemetry/api");
const express = require("express");

const app = express();

const tracer = opentelemetry.trace.getTracer("server3", "1.0.0");

app.get("/view", (req, res) => {
  const ctx = opentelemetry.propagation.extract(
    opentelemetry.context.active(),
    req.headers
  );

  const span = tracer.startSpan("GET /view", undefined, ctx);
  setTimeout(() => {
    span.end();
    res.send("Hello World!");
  }, 3000);
});

app.listen(3003, () => console.log("Server #3 listening on port 3003!"));
