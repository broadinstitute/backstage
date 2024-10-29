const { NodeSDK } = require('@opentelemetry/sdk-node');
const {
    getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

// By default exports the metrics on localhost:9464/metrics
const prometheus = new PrometheusExporter();
const sdk = new NodeSDK({
    // You can add a traceExporter field here too
    metricReader: prometheus,
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
