var cacheName = "cache-v25-11-30";
var assets = [
	"book.html",
	"books.html",
	"common.css",
	"common.js",
	"edit-book.html",
	"edit.html",
	"favicon.ico",
	"icon-192.png",
	"icon-512.png",
	"icon-apple-touch.png",
	"icon-mask.png",
	"icon.svg",
	"index.html",
	"settings.html",
	"song.html",
];

function normalizeUrl(url) {
	var queryStart = url.indexOf("?");
	if (queryStart !== -1) return url.slice(0, queryStart);
	return url;
}

self.addEventListener("install", function(event) {
	event.waitUntil(caches.open(cacheName).then(function(cache) {
		return cache.addAll(assets);
	}));
});

self.addEventListener("activate", function(event) {
	event.waitUntil(caches.keys().then(function(keys) {
		var promises = [];
		for (var i = 0; i < keys.length; i++) {
			if (keys[i] === cacheName) continue;
			promises.push(caches.delete(keys[i]));
		}
		return Promise.all(promises);
	}))
});

self.addEventListener("fetch", function(event) {
	event.respondWith(
		caches.match(normalizeUrl(event.request.url)).then(function(result) {
			return result || fetch(event.request.url);
		})
	);
});