module.exports = {
  entry: "./js/permascript.js",
  output: {
    path: "src/js/",
    filename: "permascript.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: "babel",
        query: {
          presets: ["react", "es2015"]
        }
      }
    ]
  }
};
