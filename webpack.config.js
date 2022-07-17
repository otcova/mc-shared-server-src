const path = require("path");

module.exports = mode => {
	mode.production = true
	return {
		watch: mode.production ? false : true,
		mode: mode.production ? "production" : "development",
		devtool: mode.production ? "source-map" : "eval-source-map",
		target: "electron13.1-renderer",
		entry: {
			index: path.resolve(__dirname, "src", "index.js")
		},
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "bundle.js"
		},
		module: {
			rules: [
				{
					test: /(?<!\.off)\.js$/,
					exclude: /node_modules/,
					enforce: "pre",
					use: ["babel-loader"]
				}
			]
		},
		resolve: {
			mainFields: ['main', 'module'],
		},
	}
};