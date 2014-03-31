["complex", "minifier", "simple", "regex"].forEach(function (name) {
  console.log("\nExecuting " + name + "-example.js")
  require("./" + name + "-example.js")
})