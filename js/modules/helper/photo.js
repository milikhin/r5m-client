define(['./index'], function(Helper) {
	var msg = {
		LOADED: 'Сайт успешно загружен',
		SAVED: 'Изменения успешно сохранены',
		REMOVED: 'Удаление выполнено успешно'
	};

	var res = new Helper({
		position: ['above', 'before'],
		timeout: 5000,

		messages: msg
	});

	//make short links to methods
	var debugFn = res.debug;

	res.d = res.debug = function() {
		if(!window.r5m.isDebug) {
			return false;
		}

		debugFn.apply(res, arguments);
	};
	res.i = res.info;
	res.e = res.error;

	return res;
});
