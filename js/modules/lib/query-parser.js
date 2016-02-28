define([], function () {
	function QueryParser(queryString) {
		this.query = queryString.indexOf('?') == 0 ? queryString.substring(1) : queryString;
	}

	QueryParser.prototype.get = function (varName) {
		var query = this.query;
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == varName) {
				return decodeURI(pair[1]);
			}
		}

		return undefined;
	};

	return QueryParser;
});
