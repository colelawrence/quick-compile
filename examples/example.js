rehab = require("../")

var cssMinifier = function (code) {
	return code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/([\n\:\{\}\;]|[\w\d]\s)[\s\n]+/g, "$1")
}

var cssFiles = [
			"./files/css/normallize.css",
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
	}
}

compiler = new rehab(options)