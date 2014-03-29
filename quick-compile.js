var fs = require('fs')
var path = require('path')
module.exports = (function () {
	var quickCompile = function (options) {
		this.files = options.files
		this.separator = options.separator || ""
		this.compiler = options.compiler || false
    this.regex = options.regex || false
		this.log = typeof options.log === "undefined" ? function(m) {console.log(m)} : options.log
	}
	quickCompile.prototype = {
    processor: function (fileArray, sep, regex, comp) {
      var out = ""
      var input
      for (var i = 0, len = fileArray.length; i < len; i++) {
        var filePath = fileArray[i]
        var stat
        try {
          stat = fs.statSync(filePath)
          if (/^res/.test(filePath)) throw new Error("Wrong folder")
        } catch (error) {
          this.log("statError - filePath: " + filePath)
          throw error
        }
        if (stat.isFile()) {
          if (regex && !regex.test(filePath)) continue
          input = String(fs.readFileSync(filePath))
          if (comp) input = comp(input)
          out += !!i ? sep + input : input
        } else {
          var dirFiles = fs.readdirSync(filePath)
          dirFiles = dirFiles.map(function (fileName) {
            return path.join(filePath, fileName)
          })
          try {
            out += this.processor(dirFiles, sep, regex, comp)
          } catch (error) {
            this.log("processorError - filePath: " + filePath)
            throw error
          }
        }
      }
      return out
    },
    generator: function (outputPath, options) {
      var comp = typeof options.compiler === "undefined" ? this.compiler : options.compiler
      var sep = options.separator || this.separator
      var regex = options.regex || this.regex
      if (regex && typeof regex === "string") regex = new RegExp(regex)
      var fileArray = options.files || []
      if (typeof fileArray === "string") fileArray = [fileArray]
      var log = this.log
      var out
      try {
        out = this.processor(fileArray, sep, regex, comp)
			} catch (error) {
        this.log("generatorError - fileArray: [" + fileArray.toString() + "]")
        throw error
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
        // Check if array or object
				if (typeof v.length !== "undefined")
          options = { files: v }
        else
					options = v
				this.generator(key, options)
			}
		}
	}
	return quickCompile
}())