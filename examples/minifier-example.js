var quickCompile = require("../")

var cssMinifier = function (code) {
	return code.replace(/\/[\n\s]*\*[\s\S]*?\*\/[\n\s]*/g, "").replace(/([\n\:\{\}\;,]|[\w\d\*]\s)([\s\n\}\{]+)/g, function (match, prec, suff) {
		return prec + suff.replace(/[\s\n]+/g, "")
	})
}

var options = {
	compiler: cssMinifier,
	files: {
		"resources/minifier-example.css": "./files/css"
	},
	separator: "\n"
}

compiler = new quickCompile(options)

compiler.generate()