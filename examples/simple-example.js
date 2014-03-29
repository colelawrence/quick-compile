var quickCompile = require("../")

var options = {
	files: {
		"resources/simple-example.css": "./files/css"
	},
	separator: "\n"
}

compiler = new quickCompile(options)

compiler.generate()