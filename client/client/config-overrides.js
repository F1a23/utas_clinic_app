module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.js$/,
    enforce: "pre",
    use: ["source-map-loader"],
    exclude: [/node_modules\/react-datepicker/], // تجاهل التحذيرات من react-datepicker فقط
  });
  return config;
};
