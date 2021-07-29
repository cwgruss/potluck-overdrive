import Vue from "vue";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

export function intializeSentry(): Promise<void> {
  return Promise.resolve().then(() => {
    console.log("Initializing Sentry ..");

    Sentry.init({
      Vue,
      dsn: "https://93e2b199b77549c69cd98198b665d670@o923883.ingest.sentry.io/5871691",
      integrations: [new Integrations.BrowserTracing()],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });
  });
}
