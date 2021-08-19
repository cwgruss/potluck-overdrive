const path = require("path");

const PrerenderSpaPlugin = require("prerender-spa-plugin");

const productionPlugins = [];

const prerenderPlugin = new PrerenderSpaPlugin({
  staticDir: path.join(__dirname, "dist"),
  routes: ["/"],
  postProcess(renderedRoute) {
    renderedRoute.html = renderedRoute.html
      .replace(/<script (.*?)>/g, "<script $1 defer>")
      .replace('id="app"', 'id="app" data-server-rendered="true"');

    return renderedRoute;
  },
  renderer: new PrerenderSpaPlugin.PuppeteerRenderer({
    injectProperty: "__prerender",
    inject: {},
    renderAfterDocumentEvent: "render-event",
    headless: true,
    ignoreHTTPSErrors: true,
    maxConcurrentRoutes: 3,
    timeout: 0,
    captureAfterTime: 5000,
  }),
});

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
    console.log(process.env.PRERENDER);
    if (process.env.PRERENDER === "true") {
      console.info("Pre-rendering.");
      config.plugins.push(prerenderPlugin);
    }
    config.devtool = "source-map";
  },
  chainWebpack: (config) => {
    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    types.forEach((type) =>
      addStyleResource(config.module.rule("scss").oneOf(type))
    );
  },
};
