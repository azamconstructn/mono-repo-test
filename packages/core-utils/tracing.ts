import { trace, SpanStatusCode, Span, Attributes } from "@opentelemetry/api";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

let tracer: ReturnType<typeof trace.getTracer>;

export const initTracing = (
  serviceName: string,
): ReturnType<typeof trace.getTracer> => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  const otlpExporter = new OTLPTraceExporter({
    url:
      process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
      "http://localhost:4318/v1/traces",
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter as any));
  provider.register();

  // Register instrumentations
  registerInstrumentations({
    instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
  });

  tracer = trace.getTracer(serviceName);
  return tracer;
};

export const getTracer = (): ReturnType<typeof trace.getTracer> => {
  if (!tracer) {
    throw new Error("Tracing not initialized. Call initTracing() first.");
  }
  return tracer;
};

export const createSpan = (name: string, attributes?: Attributes): Span => {
  const currentTracer = getTracer();
  return currentTracer.startSpan(name, { attributes });
};

export const addSpanEvent = (
  span: Span,
  name: string,
  attributes?: Attributes,
): void => {
  span.addEvent(name, attributes);
};

export const setSpanAttributes = (span: Span, attributes: Attributes): void => {
  Object.entries(attributes).forEach(([key, value]) => {
    span.setAttribute(key, value as string | number | boolean);
  });
};

export const setSpanError = (span: Span, error: Error): void => {
  span.setStatus({
    code: SpanStatusCode.ERROR,
    message: error.message,
  });
  span.recordException(error);
};

export const withSpan = async <T>(
  name: string,
  fn: (span: Span) => Promise<T>,
  attributes?: Attributes,
): Promise<T> => {
  const span = createSpan(name, attributes);

  try {
    const result = await fn(span);
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    setSpanError(span, error as Error);
    throw error;
  } finally {
    span.end();
  }
};

export const traceFunction = <T extends unknown[], R>(
  name: string,
  fn: (...args: T) => Promise<R>,
) => {
  return async (...args: T): Promise<R> => {
    return withSpan(name, async (span) => {
      setSpanAttributes(span, { args: JSON.stringify(args) });
      return await fn(...args);
    });
  };
};

export const endSpan = (span: Span) => {
  span.end();
};
