const opentelemetry = require('@opentelemetry/api');

const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");

const {
  SEMRESATTRS_SERVICE_NAME,
} = require("@opentelemetry/semantic-conventions");

const { NodeTracerProvider, SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-node");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { Resource } = require("@opentelemetry/resources");

const {
  ExpressInstrumentation,
} = require("@opentelemetry/instrumentation-express");

// NOTE: вроде как работает, пишет, но не объединяет запросы с под-запросами
module.exports = (serviceName) => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: serviceName,
    }),
  });

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [HttpInstrumentation, ExpressInstrumentation],
  });

  const exporter = new JaegerExporter({
    endpoint: "http://jaeger:14268/api/traces",
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  provider.register();

  return opentelemetry.trace.getTracer(serviceName);
};
