module.exports = {
  entry: "./js/permascript.js",
  output: {
    path: __dirname + "/src/js/",
    filename: "permascript.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
        query: {
          presets: ["react", "es2015"]
        }
      }
    ]
  }
};
