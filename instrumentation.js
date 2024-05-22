/*instrumentation.js*/
// Require dependencies
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-node");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");

const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

const {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} = require("@opentelemetry/sdk-metrics");

const sdk = new NodeSDK({
  traceExporter: new JaegerExporter({
    endpoint: "http://jaeger:14268/api/traces",
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
