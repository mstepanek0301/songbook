function compareStrings(a, b) {
	var aLower = a.toLowerCase(), bLower = b.toLowerCase();
	if (aLower === bLower) return 0;
	if (aLower < bLower) return -1;
	return 1;
}

function validateId(id) {
	for (var i = 0; i < id.length; i++) {
		var charCode = id.charCodeAt(i);
		if (charCode < 48 || charCode >= 58) return false;
	}
	return true;
}

// SETTINGS

var settings = JSON.parse(localStorage.getItem("sbSettings") || "{}");
function setDefault(option, value) {
	if (!(option in settings)) settings[option] = value;
}
setDefault("sort-songs-by", "date-modified");
setDefault("sort-books-by", "date-modified");
setDefault("scale", "b");
setDefault("tuning", "E A G D B E");
setDefault("note-1", "sharp");
setDefault("note-4", "sharp");
setDefault("note-6", "sharp");
setDefault("note-9", "sharp");
setDefault("note-11", "sharp");
setDefault("dir", "ltr");

// functions to be called when exiting and entering the page
function setupSaving(save, unsave) {
	document.addEventListener("visibilitychange", function() {
		if (document.hidden) save();
		else unsave();
	})
	window.addEventListener("pageshow", unsave);
	window.addEventListener("pagehide", save);
	window.addEventListener("beforeunload", save);
}


// INPUT READING

function endOfInput(input) {
	return input.buffer.length === input.index;
}

function readUntil(input, str) {
	var oldIndex = input.index;
	var index = input.buffer.indexOf(str, input.index);
	if (index === -1) {
		input.index = input.buffer.length;
		return input.buffer.slice(oldIndex);
	}
	input.index = index + str.length;
	return input.buffer.slice(oldIndex, index);
}


// HTML WRITING

function writeOpenTag(out, tag) {
	out.push("<");
	out.push(tag);
	out.push(">");
}

function writeText(out, text) {
	for (var i = 0; i < text.length; i++) {
		switch (text[i]) {
			case "<": out.push("&lt;"); break;
			case "\"": out.push("&quot;"); break;
			case "&": out.push("&amp;"); break;
			default: out.push(text[i]);
		}
	}
}

function writeOpenTagAttr(out, tag, attr, value) {
	out.push("<");
	out.push(tag);
	out.push(" ");
	out.push(attr);
	out.push("=\"");
	writeText(out, value);
	out.push("\">");
}

function writeCloseTag(out, tag) {
	out.push("</");
	out.push(tag);
	out.push(">");
}

function writeTagText(out, tag, text) {
	writeOpenTag(out, tag);
	writeText(out, text);
	writeCloseTag(out, tag);
}

function writeTagHtml(out, tag, html) {
	writeOpenTag(out, tag);
	out.push(html);
	writeCloseTag(out, tag);
}


// QUERY PARAMETERS

// saving the result once computed
var queryParameters = null;

// doesn't support escapes but we don't need those
function parseQueryString() {
	queryParameters = {};
	var queryStart = location.href.indexOf("?");
	if (queryStart === -1) return;
	var input = {buffer: location.href, index: queryStart + 1};
	while (!endOfInput(input)) {
		var param = readUntil(input, "=");
		var value = readUntil(input, "&");
		queryParameters[param] = value;
	}
}

function getQueryParameter(param) {
	if (queryParameters === null) parseQueryString();
	return queryParameters[param];
}