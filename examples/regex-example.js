var quickCompile = require("../")

var options = {
	files: {
		"resources/regex-example.css": {
      files: ["./files/vendors", "./files/css"],
      regex: /\.css$/
    }
	},
	separator: "\n",
}

compiler = new quickCompile(options)

compiler.generate()