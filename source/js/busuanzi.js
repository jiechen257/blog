var counter;

!(function () {
	var onReady;
	var queue = [];
	var ready = false;

	function flush() {
		ready = true;
		document.removeEventListener("DOMContentLoaded", flush);
		queue.forEach(function (fn) {
			fn.call(document);
		});
		queue = [];
	}

	onReady = function (fn) {
		if (ready || document.readyState === "interactive" || document.readyState === "complete") {
			fn.call(document);
			return;
		}
		queue.push(fn);
		document.addEventListener("DOMContentLoaded", flush);
	};

	function fetchVisitorCount() {
		var isCnDomain = window.location.hostname.endsWith(".cn");
		var apiBase = isCnDomain ? "https://cn.vercount.one" : "https://vercount.one";
		var callbackName = "VisitorCountCallback_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
		var script = document.createElement("script");
		var timeoutId = null;

		return new Promise(function (resolve, reject) {
			function cleanup() {
				if (timeoutId) clearTimeout(timeoutId);
				delete window[callbackName];
				if (script.parentNode) script.parentNode.removeChild(script);
			}

			window[callbackName] = function (payload) {
				cleanup();
				resolve(payload || {});
			};

			script.onerror = function () {
				cleanup();
				reject(new Error("Failed to load visitor counter script"));
			};

			timeoutId = setTimeout(function () {
				cleanup();
				reject(new Error("Visitor counter request timed out"));
			}, 8000);

			script.src =
				apiBase +
				"/log?url=" +
				encodeURIComponent(window.location.href) +
				"&jsonpCallback=" +
				encodeURIComponent(callbackName);
			document.head.appendChild(script);
		});
	}

	function toSafeNumber(input) {
		var value = Number(input);
		return Number.isFinite(value) ? value : 0;
	}

	counter = {
		counterIds: ["site_pv", "site_uv"],
		offsetMap: {
			site_pv: 3500,
			site_uv: 1024,
		},
		updateText: function (payload) {
			this.counterIds.forEach(
				function (id) {
					var valueNode = document.getElementById("busuanzi_value_" + id);
					if (!valueNode) return;
					var base = toSafeNumber(payload[id]);
					var number = base + toSafeNumber(this.offsetMap[id]);
					valueNode.textContent = String(number);
				}.bind(this)
			);
		},
		setFallback: function (fallbackText) {
			this.counterIds.forEach(function (id) {
				var valueNode = document.getElementById("busuanzi_value_" + id);
				if (valueNode) valueNode.textContent = fallbackText;
			});
		},
	};

	if (["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)) {
		onReady(function () {
			counter.setFallback("0");
		});
		return;
	}

	fetchVisitorCount()
		.then(function (payload) {
			onReady(function () {
				counter.updateText(payload);
			});
		})
		.catch(function (error) {
			onReady(function () {
				counter.setFallback("0");
			});
			console.warn("Visitor count unavailable:", error);
		});
})();
