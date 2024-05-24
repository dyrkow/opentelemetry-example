require("./instrumentation")("server2");

const opentelemetry = require("@opentelemetry/api");
const express = require("express");

const app = express();

const tracer = opentelemetry.trace.getTracer("server2", "1.0.0");

app.get("/search", (req, res) => {
  // Получает контекст родительского спана
  const parentContext = opentelemetry.propagation.extract(
    opentelemetry.context.active(),
    req.headers
  );

  // Стартуем новый спан в контексте родительского
  const root = tracer.startSpan("GET /search", undefined, parentContext);

  // Устанавливаем контекст внутри спана
  const ctx = opentelemetry.trace.setSpan(parentContext, root);

  // Добавляем в переменную данные контекста спана
  const output = {};
  opentelemetry.propagation.inject(ctx, output);

  setTimeout(async () => {
    root.end();

    // Делаем запрос к сервису, передавая данные текущего спана
    const response = await fetch("http://server3:3003/view", {
      headers: {
        traceparent: output["traceparent"],
        tracestate: output["tracestate"],
      },
    });

    const data = await response.text();

    res.send(data);
  }, 2000);
});

app.listen(3002, () => console.log("Server #2 listening on port 3002!"));
