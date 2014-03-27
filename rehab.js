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
			var sep = options.separator || this.separator
			var comp = typeof options.compiler === "undefined" ? this.compiler : options.compiler
			var filearr = options.files || []
			for (var i = 0, len = filearr.length; i < len; i++) {
				input = String(fs.readSync(filearr[i]))
				out +=  input + sep
			}
			if (comp)
				out = comp(out)
			fs.writeSync(key, out)
			if (log) log("Writing file: \"" + key + "\" with " + out.length + " characters")
		},
		generate: function () {
			var log = this.log
			var fl = this.files
			var options
			var key, v 
			for (key in fl) {
				v = fl[key]
				if (v.forEach != null)
					options = { files: v }
				else
					options = v
				this.generator(options)
			}
		}
	}
	return rehab
}())