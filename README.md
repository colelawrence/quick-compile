quick-compile
=============

This is a *very* easy to use file concatenator and writer.

## Example

This script **reads** all the files in `./vendors/css` and then combines them with the files in `./files/css`
and then **writes** them to `resources/styles.css`

```javascript
var quickCompile = require("quick-compile")

var options = {
	files: {
		"resources/styles.css": ["./vendors/css", "./files/css"]
	},
	separator: "\n"
}

compiler = new quickCompile(options)

compiler.generate()
```

## Options

quick-compile has many useful options that help you configure the way files are concatenated.

* **files** - `String` or `Array` of the path or files you are targetting (required)

* **separator** - `String` used to separate the files

* **compiler** - `Function` that returns modified src, useful for minifying

* **regex** - `RegExp` that is used to determine which files you are targetting

* **log** - `Function` that handles output from quick-compile, can be set to *false*


More examples are available in the examples folder.
