module.exports = {
  entry: {
    bundle: './js/home.js',
    sending_via_gmail: './js/sending_via_gmail.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/public'
  },
  module: {
      loaders: [
        { test: /\.hbs/, loader: "handlebars-template-loader" },
      ]
  },
}
