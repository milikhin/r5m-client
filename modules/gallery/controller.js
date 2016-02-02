define([
	'./ui'
], function (Ui) {

	var $ = document.querySelectorAll.bind(document);

	function Gallery() {
		this.title = 'gallery';
		this.name = 'Галерея изображений';
		// this.model = model;

		this._selector = '.r5m-custom-page, .gallery-container';
		this._photos = {};

		this.ui = new Ui('r5m-gallery-img', 'r5m-gallery-link').init();
	}

	Gallery.prototype.init = function () {
		this.pageElems = $(this._selector);
		this._updatePhotosList();
	};

	Gallery.prototype._updatePhotosList = function () {
		[].forEach.call(this.pageElems, function (pageElem) {
			this._photos[pageElem.dataset.pageId] = [];

			var imgElems = pageElem.getElementsByClassName('r5m-gallery-img');
			[].forEach.call(imgElems, function (imgElem) {
				// console.log(imgElem);
				this._photos[pageElem.dataset.pageId].push(imgElem.dataset.fileName);
			}, this);
		}, this);

		console.log('photos now: ', this._photos);
	};

	return new Gallery();
});
