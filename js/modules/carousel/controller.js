define(['./carousel'], function (Carousel) {
	console.log(Carousel);

	function CarouselController() {}

	CarouselController.prototype.init = function () {
		[].forEach.call(document.querySelectorAll('.carousel'), function (elem) {
			new Carousel(elem, {
				isAuto: !(elem.dataset && elem.dataset.manual),
        rounded: true
			});
		});
	};

	return new CarouselController();
});
