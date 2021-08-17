const path = require("path");

const PrerenderSpaPlugin = require("prerender-spa-plugin");

const productionPlugins = [
  new PrerenderSpaPlugin({
    staticDir: path.join(__dirname, "dist"),
    routes: ["/"],
    postProcess(renderedRoute) {
      renderedRoute.html = renderedRoute.html
        .replace(/<script (.*?)>/g, "<script $1 defer>")
        .replace('id="app"', 'id="app" data-server-rendered="true"');

      return renderedRoute;
    },
    renderer: new PrerenderSpaPlugin.PuppeteerRenderer({
      // We need to inject a value so we're able to
      // detect if the page is currently pre-rendered.
      // inject: {},
      // Our view component is rendered after the API
      // request has fetched all the necessary data,
      // so we create a snapshot of the page after the
      // `data-view` attribute exists in the DOM.
      // renderAfterElementExists: "[data-view]",

      inject: {},
      renderAfterDocumentEvent: "render-event",
      headless: true,
      ignoreHTTPSErrors: true,
      maxConcurrentRoutes: 1,
      timeout: 0,
      captureAfterTime: 5000,
    }),
  }),
];

function addStyleResource(rule) {
  rule
    .use("style-resource")
    .loader("style-resources-loader")
    .options({
      patterns: [path.resolve(__dirname, "./src/scss/abstracts/_main.scss")],
    });
}

module.exports = {
  configureWebpack: (config) => {
    // if (process.env.NODE_ENV === "production") {
    //   config.plugins.push(...productionPlugins);
    // }
    config.devtool = "source-map";
  },
  chainWebpack: (config) => {
    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    types.forEach((type) =>
      addStyleResource(config.module.rule("scss").oneOf(type))
    );
  },
};
