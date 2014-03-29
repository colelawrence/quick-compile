var quickCompile = require("../")
var util = require("util")
var ugly = require("uglify-js")

var cssMinifier = function (code) {
	return code.replace(/\/[\n\s]*\*[\s\S]*?\*\/[\n\s]*/g, "").replace(/([\n\:\{\}\;,]|[\w\d\*]\s)([\s\n\}\{]+)/g, function (match, prec, suff) {
		return prec + suff.replace(/[\s\n]+/g, "")
	})
}

var cssFiles = [
      "./files/vendors",
			"./files/css"
		]
var jsFiles = [
			"./files/vendors",
			"./files/js"
		]
var options = {
	files: {
    "resources/complex-example.min.css": {
      files: cssFiles,
      regex: /\.css$/,
      compiler: cssMinifier
    },
    "resources/complex-example.min.js": {
      files: jsFiles,
      regex: /\.js$/,
      separator: ";\n",
      compiler: function (src) {
        return ugly.minify(src, {
              fromString: true
          }).code
      }
    },
    "resources/complex-example.css": {
      files: cssFiles,
      regex: /\.css$/
    },
    "resources/complex-example.js": {
      files: jsFiles,
      regex: /\.js$/,
      separator: ";\n"
    }
	},
	log: function (msg) {
		console.log("quickCompile: " + util.inspect(msg));
	},
	separator: "\n"
}

compiler = new quickCompile(options)

compiler.generate()