define(['./carousel'], function (Carousel) {
  console.log(Carousel);

  function CarouselController() {}

	CarouselController.prototype.init = function () {
		[].forEach.call(document.querySelectorAll('.carousel'), function (elem) {
			new Carousel(elem);
		});
	};

	return new CarouselController();
});
