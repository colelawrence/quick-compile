/* jquery */
window.$ = function (sel) {
	var selectors = sel.split(" ")
	var currentElement = document
	for (var index = 0, len = selectors.length; index < len; index++) {
		var selector = selectors[index]
		var match = selector.match(/^([\#\.]?)([\w\d\-_]+)$/)
		if (match) {
			var elementsFound;
			switch(match[1]) {
				case "#":
					elementsFound = [document.getElementById(match[2])]
					break;
				case ".":
					elementsFound = currentElement.getElementsByClassName(match[2])
					break;
				default:
					elementsFound = currentElement.getElementsByTagName(match[2])
			}
			if (elementsFound.length) currentElement = elementsFound[0]
			else return null
		}
		else throw "Invalid selector part: \"" + selector + "\" in \"" + sel + "\""
	}
	return currentElement
};
/* page */
if (window.quotes != null) {
	for (var i = 0; i < window.quotes.length; i++) {
		$("#quotes").innerHTML += "<blockquote>" + window.quotes[i] + "</blockquote>"
	};
}