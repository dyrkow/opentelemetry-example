const { NodeSDK } = require("@opentelemetry/sdk-node");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");

const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

const sdk = new NodeSDK({
  traceExporter: new JaegerExporter({
    endpoint: "http://jaeger:14268/api/traces",
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
