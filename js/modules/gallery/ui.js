define([], function() {
    var $ = document.querySelectorAll.bind(document);

    /*
    * images: {
    		url: оригинальное изображение
    			alt: подпись
    		}
    		currentIndex: Current enlarged image's index (in the current gallery)
    		total : Total amount of images in the gallery
    *
    */
    function ImageZoomer(imageClass, linkClass, containerElem) {
        var self = this;
        linkClass = linkClass || imageClass;
        if (!imageClass || !linkClass) {
            return;
        }

        this.images = [];
        this.imageClass = imageClass;
        this.linkClass = linkClass;
        this.__rootElem = containerElem || document;
        this.imageElems = this.__rootElem.getElementsByClassName(imageClass);
        [].forEach.call(this.imageElems, function(imageElem) {
            // Что же я хотел этим сказать? О_о
            // ...ах да, если в массиве еще нет объектов с img == dataset.href, добавить его!
            if (!self.images.filter(function(img) {
                    return img.url == imageElem.dataset.href;
                }).length) {
                self.images.push({
                    url: imageElem.dataset.href,
                    alt: imageElem.dataset.alt || imageElem.getAttribute('alt') || ""
                });
            }
        });

        console.log(self.images);
        this.currentIndex = 0;
        this.total = this.images.length;
        this._onKeyHandler = this._onKey.bind(this);
    }

    // create UI elements here
    ImageZoomer.prototype.init = function() {
        var slider = document.createElement('div');
        var sliderImage = document.createElement('img');
        var imageWrapper = document.createElement('figure');
        var imgCaption = document.createElement('figcaption');
        var imgCaptionContent = document.createElement('span');
        var loader = document.createElement('div');
        var self = this;
        loader.innerHTML = '<i class="fa fa-spin fa-refresh"></i>';
        loader.classList.add('image-zoomer__loading');
        loader.classList.add('image-zoomer__loading-visible');
        this.loader = loader;

        slider.classList.add('image-zoomer');
        sliderImage.classList.add('image-zoomer__image');
        sliderImage.classList.add('fade');

        imageWrapper.appendChild(sliderImage);
        imageWrapper.appendChild(imgCaption);

        imgCaption.appendChild(imgCaptionContent);
        imgCaption.appendChild(loader);
        slider.appendChild(imageWrapper);
        document.body.appendChild(slider);

        this.slider = slider;
        this.sliderCaptionElem = imgCaptionContent;
        this.preloaderImgElem = document.createElement('img');

				this.speedUpPreloaderElem = document.createElement('img');
				document.body.appendChild(this.speedUpPreloaderElem);
				this.speedUpPreloaderElem.style.position = "absolute";
				this.speedUpPreloaderElem.style.height = 0;
				this.speedUpPreloaderElem.style.width = 0;
				this.speedUpPreloaderElem.style.borderWidth = 0;

        this.sliderImageElem = sliderImage;
        this.preloaderImgElem.onload = function() {
            sliderImage.classList.remove('fade-in');
            sliderImage.classList.add('fade-out');
            var img = this;
            setTimeout(function() {
                self.sliderImageElem.src = img.src;
            }, 400);

        };

        this.sliderImageElem.onload = function() {
            sliderImage.classList.remove('fade-out');
            sliderImage.classList.add('fade-in');
            loader.classList.remove('image-zoomer__loading-visible');
        };

        this._createButtons();
        this._registerEventHandlers();

    };

    ImageZoomer.prototype.open = function() {
        this._registerKeyboardEvents();
        this.slider.classList.add('visible');
    };

    ImageZoomer.prototype.close = function() {
        this._unregisterKeyboardEvents();
        this.slider.classList.remove('visible');
    };

    ImageZoomer.prototype._createButtons = function() {
        var nav = document.createElement('nav');
        var prev = document.createElement('button');
        var next = document.createElement('button');
        var close = document.createElement('button');

        prev.classList.add('image-zoomer__left');
        next.classList.add('image-zoomer__right');
        close.classList.add('image-zoomer__close');

        next.innerHTML = '<div class="image-zoomer__text">>></div>';
        prev.innerHTML = '<div class="image-zoomer__text"><<</div>';
        close.innerHTML = '<i class="fa fa-close"></i>';

        nav.appendChild(prev);
        nav.appendChild(next);
        nav.appendChild(close);

        this.nextButtonElem = next;
        this.prevButtonElem = prev;
        this.closeButtonElem = close;

        this.slider.appendChild(nav);
    };

    ImageZoomer.prototype._registerEventHandlers = function() {
        console.log('Registering Zoomer event handlers');
        if (!this.imageClass || !this.linkClass) {
            throw new Error('Error in gallery engine: missing requrired elements');
        }
        var self = this;
        document.body.addEventListener('click', function(evt) {
            var goodTarget = evt.target.closest("." + self.linkClass);
            // console.log('Target: ', goodTarget, self.imageClass, evt.target);

            if (!goodTarget || !self.__rootElem.contains(goodTarget)) {
                return;
            }

            evt.preventDefault();
            self.showPicture(goodTarget.dataset.href, goodTarget.dataset.alt);
        });

        this.nextButtonElem.onclick = function() {
            self.showNext();
        };

        this.prevButtonElem.onclick = function() {
            self.showPrev();
        };

        this.closeButtonElem.onclick = function() {
            self.close();
        };
    };

    ImageZoomer.prototype.showNext = function() {
        var curNumber = this.normalizeImageNumber(this.currentNumber + 1);
        this._oops = this.currentNumber == curNumber ? 1 : 0;
        this.showPicture(curNumber);
    };

    ImageZoomer.prototype.showPrev = function() {
        var curNumber = this.normalizeImageNumber(this.currentNumber - 1);
        this._oops = this.currentNumber == curNumber ? -1 : 0;
        this.showPicture(curNumber);
    };

    ImageZoomer.prototype._onKey = function(event) {
        console.log(event.keyCode);
        switch (+event.keyCode) {
            case 37 /* left */ :
                {
                    this.showPrev();
                    break;
                }
            case 39 /* right */ :
                {
                    this.showNext();
                    break;
                }
            case 27 /* Esc */ :
                {
                    this.close();
                }
        }
    };

    ImageZoomer.prototype._registerKeyboardEvents = function() {
        document.addEventListener('keydown', this._onKeyHandler);
    };

    ImageZoomer.prototype._unregisterKeyboardEvents = function() {
        document.removeEventListener('keydown', this._onKeyHandler);
    };

    ImageZoomer.prototype.normalizeImageNumber = function(imageNumber) {
        if (imageNumber >= this.total) {
            imageNumber = this.total - 1;
        }

        if (imageNumber < 0) {
            imageNumber = 0;
        }

        return imageNumber;
    };

    ImageZoomer.prototype._cacheImage = function(index) {
        console.log(this.images[index].url);
        this.speedUpPreloaderElem.src = this.images[index].url;
    };

    ImageZoomer.prototype.showPicture = function(hrefOrIndex) {
        var self = this;
        var href = (+hrefOrIndex || +hrefOrIndex === 0) ? this.images[+hrefOrIndex].url : hrefOrIndex;

        if (window.innerWidth < 800) {
            window.open(href);
            return false;
        }

        var curIndex = 0;
        for (var i = 0; i < this.images.length; i++) {
            if (this.images[i].url == href) {
                curIndex = i;
            }
        }

        if (curIndex < this.images.length - 1) {
            this._cacheImage(curIndex + 1);
            if (curIndex > 0) {
                this.speedUpPreloaderElem.onload = function() {
                    self._cacheImage(curIndex - 1);
										this.onload = function() {};
                }
            }
        } else if (curIndex > 0) {
            self._cacheImage(curIndex - 1);
        }


        if (!this.slider.classList.contains('visible')) {
            this.open();
        }

        // if HREF is given, then navigation is Ok (we are not trying to go before 0 of after last image)
        if (!(+hrefOrIndex || +hrefOrIndex === 0)) {
            this._oops = 0;
        }

        if (this._oops) {
            return false;
        }

        var alt = "";

        if (href) {
            this.loader.classList.add('image-zoomer__loading-visible');

            this.images.forEach(function(imageDesc, i) {
                if (href == imageDesc.url) {
                    self.currentNumber = i;
                    alt = imageDesc.alt;
                }
            });

            self.prevButtonElem.classList[self.currentNumber === 0 ? "add" : "remove"]('inactive');
            self.nextButtonElem.classList[self.currentNumber === self.total - 1 ? "add" : "remove"]('inactive');

            self.preloaderImgElem.src = href;
            if (alt) {
                this.sliderCaptionElem.innerHTML = alt +
                    ' (' +
                    (self.currentNumber + 1) +
                    '/' +
                    self.total +
                    ')';
            } else {
                this.sliderCaptionElem.innerHTML = 'Изображение ' +
                    (self.currentNumber + 1) +
                    ' из ' +
                    self.total;
            }
        }

        // document.querySelector('.preview img').src="img/" + currentFolder + "/" + n + ".JPG";
        // document.querySelector('.preview').style.display = "block";
        // currentPicture = n;

        // var pn = imagesNumber[currentFolder];
        // document.querySelector('.next').classList[currentPicture == pn ? "add" : "remove"]('inactive');
        // document.querySelector('.prev').classList[currentPicture == 1 ? "add" : "remove"]('inactive');
    };

    return ImageZoomer;
});

// event.type должен быть keypress
function getChar(event) {
    if (event.which == null) { // IE
        if (event.keyCode < 32) return null; // спец. символ
        return String.fromCharCode(event.keyCode);
    }

    if (event.which != 0 && event.charCode != 0) { // все кроме IE
        if (event.which < 32) return null; // спец. символ
        return String.fromCharCode(event.which); // остальные
    }

    return null; // спец. символ
}
