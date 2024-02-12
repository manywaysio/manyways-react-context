module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            // test: /\.(css|scss)$/,
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [
              "sass-to-string",
              {
                loader: "sass-loader",
                options: {
                  sassOptions: {
                    outputStyle: "compressed",
                  },
                },
              },
            ],
          },
        ],
      },
      entry: "./src/index.js",
      output: {
        filename: "static/js/manyways.js",
      },
    },
  },
};
