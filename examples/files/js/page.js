/* page */
if (window.quotes != null) {
	for (var i = 0; i < window.quotes.length; i++) {
		$("#quotes").innerHTML += "<blockquote>" + window.quotes[i] + "</blockquote>"
	};
}