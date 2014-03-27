var fs = require('fs')
module.exports = (function () {
	var rehab = function (options) {
		this.files = options.files
		this.separator = options.separator || ""
		this.compiler = options.compiler || false
		this.log = options.log || false
	}
	rehab.prototype = {
		generator: function (outputPath, options) {
			var comp = typeof options.compiler === "undefined" ? this.compiler : options.compiler
			var sep = options.separator || this.separator
			var log = this.log
			var patharr = options.files || []
			var out = ""
			var input
			for (var i = 0, len = patharr.length; i < len; i++) {
				input = String(fs.readFileSync(patharr[i]))				
				if (comp)
					input = comp(input)
				out += !!i ? sep + input : input
			}
			if (log) log("Writing file: \"" + outputPath + "\" with " + out.length + " characters", 1)
			fs.writeFileSync(outputPath, out)
		},
		generate: function () {
			var fl = this.files
			var options
			var key, v 
			for (key in fl) {
				v = fl[key]
				if (v.forEach != null)
					options = { files: v }
				else
					options = v
				this.generator(key, options)
			}
		}
	}
	return rehab
}())