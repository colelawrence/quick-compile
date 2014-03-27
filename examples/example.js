var quickCompile = require("../")

var cssMinifier = function (code) {
	return code.replace(/\/[\n\s]*\*[\s\S]*?\*\/[\n\s]*/g, "").replace(/([\n\:\{\}\;,]|[\w\d\*]\s)([\s\n\}\{]+)/g, function (match, prec, suff) {
		return prec + suff.replace(/[\s\n]+/g, "")
	})
}

var cssFiles = [
			"./files/css/normallizer.css",
			"./files/css/colors.css",
			"./files/css/backgrounds.css"
		]
var jsFiles = [
			"./files/js/jquery.js",
			"./files/js/page.js"
		]
var options = {
	compiler: cssMinifier,
	files: {
		"resources/style.css": cssFiles,
		"resources/script.js": {
			files: jsFiles,
			compiler: null,
			separator: ";\n"
		}
	},
	log: function (msg) {
		console.log(msg);
	},
	separator: "\n"
}

compiler = new quickCompile(options)

compiler.generate()