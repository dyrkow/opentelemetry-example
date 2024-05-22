require('./instrumentation')('server1');

const opentelemetry = require('@opentelemetry/api');
const express = require("express");

const app = express();

const tracer = opentelemetry.trace.getTracer('server1', '1.0.0');

app.get("/", async (req, res) => {
  const span = tracer.startSpan('main logic');

  console.log('Processing...');
  const response = await fetch("http://server2:3002/");
  const data = await response.text();
  console.log('Finish!', data);

  span.end();
  res.send(data);
});

app.listen(3001, () => console.log("Server #1 listening on port 3001!"));
