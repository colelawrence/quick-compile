var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
module.exports = (function () {
  var quickCompile = function (options) {
    this.files = options.files
    this.separator = options.separator || ""
    this.compiler = options.compiler || false
    this.regex = options.regex || false
    this.log = function() {
      var log = typeof options.log === "undefined" ? function(m, l) { if (l < 2) console.log(m) } : options.log
      return function (msg, level) {
        if (typeof log === "function") log(msg, level)
      }
    }()
    this.cacheFile = options.cacheFile || false
    if (this.cacheFile)
      try {
        this.cache = JSON.parse(fs.readFileSync(this.cacheFile, "utf8"))
        this.log("Found cache file: " + this.cacheFile, 2)
      } catch (err) {
        this.log("Cache file not written yet: " + this.cacheFile, 2)
        this.cache = {}
      }
    else this.cache = {}
    this.newcache = {}
  }
  quickCompile.prototype = {
    processor: function (fileArray, sep, regex) {
      var inputFiles = []
      var input
      for (var i = 0, len = fileArray.length; i < len; i++) {
        var filePath = fileArray[i]
        var stat
        try {
          stat = fs.statSync(filePath)
        } catch (error) {
          this.log("statError - filePath: " + filePath, 0)
          throw error
        }
        if (stat.isFile()) {
          if (regex && !regex.test(filePath)) continue
          inputFiles.push(filePath)
        } else {
          var dirFiles = fs.readdirSync(filePath)
          dirFiles = dirFiles.map(function (fileName) {
            return path.join(filePath, fileName)
          })
          try {
            inputFiles = inputFiles.concat(this.processor(dirFiles, sep, regex))
          } catch (error) {
            this.log("processorError - filePath: " + filePath, 0)
            throw error
          }
        }
      }
      return inputFiles
    },
    generator: function (outputPath, options) {
      var comp = typeof options.compiler === "undefined" ? this.compiler : options.compiler
      var sep = options.separator || this.separator
      var regex = options.regex || this.regex
      if (regex && typeof regex === "string") regex = new RegExp(regex)
      var fileArray = options.files || []
      if (typeof fileArray === "string") fileArray = [fileArray]
      var log = this.log
      var inputFiles
      try {
        inputFiles = this.processor(fileArray, sep, regex)
      } catch (error) {
        this.log("generatorError - fileArray: [" + fileArray.toString() + "]", 0)
        throw error
      }
      var out = ""
      var input
      var md5
      var filechanged
      var totalchanged = false
      for (var i = 0, len = inputFiles.length; i < len; i++) {
        var filePath = inputFiles[i]
        input = this.newcache[filePath]
        if (input) {
          filechanged = input.changed
          md5 = input.md5
          input = input.input
          this.log("Read cached source: " + filePath + " with " + input.length + " characters.", 2)
        } else {
          input = String(fs.readFileSync(filePath))
          md5 = crypto.createHash("md5").update(input).digest("base64")
          if (this.cacheFile && this.cache[filePath] === undefined)
            this.log("Added new file: " + filePath, 2)
          filechanged = !this.cacheFile || md5 !== this.cache[filePath]
          this.newcache[filePath] = { md5:md5, input:input, changed:filechanged }
          this.log("Read source file: " + filePath + " with " + input.length + " characters.", 2)
        }
        if (filechanged) totalchanged = true
        out += !!i ? sep + input : input
      }
      if (totalchanged) {
        if (comp)
          out = comp(out)
        this.log("Writing file: \"" + outputPath + "\" with " + out.length + " characters", 1)
        fs.writeFileSync(outputPath, out)
      } else {
        this.log("No changes for file: \"" + outputPath + "\"", 1)
      }
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
      if (this.cacheFile) {
        for (key in this.newcache)
          this.cache[key] = this.newcache[key].md5
        fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache, null, 4))
      }
    }
  }
  return quickCompile
}())