/**
 * @module Carousel.
 * @autor mikhael
 * @version 1.0*
 * @param options - options object.
 *     options.rounded - if true carousel will be infinite, if false - will stop at last/first slides
 */

define([], function () {
	"use strict";

	function Carousel(elem, options) {
		var self = this;
		this.settings = {
			step: options ? options.step || 1 : 1,
			isRounded: options ? options.rounded : true,
			classNames: {
				leftButton: "carousel__left-button",
				rightButton: "carousel__right-button",
				content: "carousel__content",
				item: "carousel__item",
				contentWrapper: "carousel__inner-wrapper",
				animation: "carousel__animation"
			}
		};

		this.carouselElem = elem;

		this.init();

		this.items = elem.getElementsByClassName(this.settings.classNames.item);
		this.realItemsCount = this.items.length;
		this.totalItemsCount = this.items.length + (this.settings.isRounded ? 2 : 0);

		if (this.settings.isRounded) {
			this._createCloneNodes();
			this._enableInfinityRoundLoop();
		}

		this._createNavigationButtons();
		this.startup();

		window.addEventListener('resize', this.resize.bind(this));
	}

	Carousel.prototype.resize = function () {
		var currentSlide = +this.carouselContentElem.getAttribute('data-carousel-currentSlide');
		this.carouselContentElem.classList.remove(this.settings.classNames.animation);
		this.moveToSlide(currentSlide);
	};

	Carousel.prototype.moveLeft = function () {
		this._shiftCarousel(-1);
	};

	Carousel.prototype.moveRight = function () {
		this._shiftCarousel(+1);
	};

	Carousel.prototype._shiftCarousel = function (step) {
		var currentIndex = +this.carouselContentElem.getAttribute('data-carousel-currentSlide');
		var newIndex = currentIndex + step;

		this.carouselContentElem.classList.add(this.settings.classNames.animation);
		this.moveToSlide(newIndex);
	};

	Carousel.prototype.moveToSlide = function (slideNumber) {
		var totalItemsWidth = this.carouselContentElem.scrollWidth;
		var newOffset = -totalItemsWidth / this.totalItemsCount * slideNumber;

		if (newOffset > 0) return; // the first slide
		if (newOffset <= -totalItemsWidth || newOffset >= this.carouselElem.clientWidth) return; //the last slide

		this.carouselContentElem.style.transform = 'translateX(' + newOffset + 'px)';
		this.carouselContentElem.setAttribute('data-carousel-offset', newOffset);
		this.carouselContentElem.setAttribute('data-carousel-currentSlide', slideNumber);
	};

	Carousel.prototype.init = function () {
		var settings = this.settings;
		var elem = this.carouselElem;

		//create wrapper
		var carouselWrapper = document.createElement('div');
		carouselWrapper.appendChild(elem.firstElementChild);
		carouselWrapper.classList.add(settings.classNames.contentWrapper);

		carouselWrapper.firstElementChild.classList.add(settings.classNames.content);
		[].forEach.call(carouselWrapper.firstElementChild.children, function (carouselItem) {
			carouselItem.classList.add(settings.classNames.item);
		});
		elem.appendChild(carouselWrapper);

		this.carouselContentElem = this.carouselElem.getElementsByClassName(this.settings.classNames.content)[0];

	};

	Carousel.prototype._createCloneNodes = function () {
		var firstItem = this.items[0];
		var lastItem = this.items[this.items.length - 1];

		var firstElemClone = firstItem.cloneNode(true);
		var lastElemClone = lastItem.cloneNode(true);

		firstElemClone.classList.add("first-clone");
		lastElemClone.classList.add("last-clone");

		this.carouselContentElem.insertBefore(lastElemClone, firstItem);
		this.carouselContentElem.insertBefore(firstElemClone, lastItem.nextSibling);
	};

	Carousel.prototype._createNavigationButtons = function () {
		//setup Left/Right button click handlers
		this.carouselElem.getElementsByClassName(this.settings.classNames.leftButton)[0].addEventListener('click', this.moveLeft.bind(this));
		this.carouselElem.getElementsByClassName(this.settings.classNames.rightButton)[0].addEventListener('click', this.moveRight.bind(this));
	};

	Carousel.prototype.startup = function () {
		this.carouselContentElem.classList.remove(this.settings.classNames.animation);
		this.moveToSlide(this.settings.isRounded ? 1 : 0);
	};

	Carousel.prototype._enableInfinityRoundLoop = function () {

		var self = this;
		var moveToRealItem = (function () {
			var currentIndex = +this.carouselContentElem.getAttribute('data-carousel-currentSlide');
			if (currentIndex === 0) {
				this.carouselContentElem.classList.remove(this.settings.classNames.animation);
				this.moveToSlide(self.totalItemsCount - 2);
			} else if (currentIndex === this.totalItemsCount - 1) {
				this.carouselContentElem.classList.remove(this.settings.classNames.animation);
				this.moveToSlide(1);
			}
		}).bind(this);
		//moveToRealItem = moveToRealItem.bind(this);

		if (window.transitionEnd) {
			window.transitionEnd(this.carouselContentElem).bind(moveToRealItem);
		} else {
			this.carouselContentElem.addEventListener('transitionend', moveToRealItem);
		}
	};

	return Carousel;
});
