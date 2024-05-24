require("./instrumentation")("server1");

const {
  SEMATTRS_CODE_FUNCTION,
  SEMATTRS_CODE_FILEPATH,
} = require("@opentelemetry/semantic-conventions");

const opentelemetry = require("@opentelemetry/api");
const express = require("express");

const app = express();

const tracer = opentelemetry.trace.getTracer("server1", "1.0.0");

// Все работает, спаны складываются один под другим у каждого сервиса
// https://opentelemetry.io/docs/languages/js/instrumentation/#create-spans

app.get("/", async (req, res) => {
  const rootSpan = tracer.startSpan("GET /");

  const ctx = opentelemetry.trace.setSpan(
    opentelemetry.context.active(),
    rootSpan
  );

  // это пример вложенных спанос с обработкой ошибок, но это просто пример
  // try {
  //   const ctx = opentelemetry.trace.setSpan(
  //     opentelemetry.context.active(),
  //     rootSpan
  //   );
  //
  //   const span = tracer.startSpan("generate", undefined, ctx);
  //
  //   span.setAttribute(SEMATTRS_CODE_FUNCTION, "generate");
  //   span.setAttribute(SEMATTRS_CODE_FILEPATH, __filename);
  //
  //   const result = Math.random();
  //   span.end();
  //
  //   console.log("hello", result);
  //
  //   rootSpan.setStatus({ code: opentelemetry.SpanStatusCode.OK });
  // } catch (err) {
  //   rootSpan.setStatus({ code: opentelemetry.SpanStatusCode.ERROR });
  //   rootSpan.recordException(err);
  // } finally {
  //   rootSpan.end();
  // }

  console.log("Processing...");

  rootSpan.setStatus({ code: opentelemetry.SpanStatusCode.OK });

  const output = {};
  opentelemetry.propagation.inject(ctx, output);

  const response = await fetch("http://server2:3002/search", {
    headers: {
      traceparent: output["traceparent"],
      tracestate: output["tracestate"],
    },
  });

  const data = await response.text();
  console.log("Finish!", data);

  rootSpan.end();
  res.send(data);
});

app.listen(3001, () => console.log("Server #1 listening on port 3001!"));
