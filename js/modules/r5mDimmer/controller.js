define([], function() {

  function r5mDimmer() {
    this.title = 'r5mDimmer';
    this.name = 'Dimmer';
  }

  r5mDimmer.prototype.init = function(dimmerElem) {
    this.dimmer = dimmerElem || document.getElementsByClassName('r5m-dimmer')[0];
    if (!this.dimmer) {
      throw new Error('Dimmer Element not found');
    }
  };

  r5mDimmer.prototype.clickHandler = function(action, target) {
    switch (action) {
      case 'show':
        this.showDimmer(target);
        break;
      case 'close':
        this.closeDimmer();
        break;
      default:
        return;
    }
  };

  r5mDimmer.prototype.showDimmer = function(target, type) {
    var self = this;
    if (!this.dimmer) {
      throw new Error('Dimmer Element not found');
    }

    var actionType = type || target.getAttribute('data-type');
    var actionText = target.getAttribute('data-text');

    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if(!document.body.style.marginRight || document.body.style.marginRight == '0px') {
      document.body.style.marginRight = scrollbarWidth + "px";
    }
		document.body.classList.add('with-dimmer');

    //по-умолчанию просто показываем dimmer
    if (!actionType) {
      self.dimmer.classList.add('r5m-dimmer-active');
    } else {
      //если есть специальный actionType
      self.showDimmerWithActionType(actionType, actionText);
    }
  };

  r5mDimmer.prototype.closeDimmer = function() {
    if (!this.dimmer) {
      return;
    }

    this.dimmer.classList.remove('r5m-dimmer-active');
		setTimeout(function() {
			document.body.classList.remove('with-dimmer');
			document.body.style.marginRight = 0;
		}, 250);
  };

  r5mDimmer.prototype.showDimmerWithActionType = function(type, defaultText) {
    // Скрываем все элементы внутри dimmer
    defaultText = defaultText || '';
    var elementsToHide = this.dimmer.getElementsByClassName('r5m-dimmer-wrapper');
    for (var i = 0; i < elementsToHide.length; i++) {
      elementsToHide[i].classList.add('is-hidden');
    }

    // показываем тот, который нам нужен
    var elementToShow = this.dimmer.getElementsByClassName('r5m-dimmer-' + type)[0];
    //console.log("e", this.dimmer.getElementsByClassName('r5m-dimmer-' + type));
    if (elementToShow) {
      elementToShow.classList.remove('is-hidden');

      // заполняем форму (ее Textarea) текстом по-умолчанию
      var textField = elementToShow.getElementsByTagName('TEXTAREA')[0];
      if (textField) {
        textField.value = defaultText || '';
        textField.dispatchEvent(new Event('input', {
          bubbles: true,
          cancelable: false
        }));
      }

    }

    this.dimmer.classList.add('r5m-dimmer-active');




    // try {
    // 	var commentsTextElem = this.dimmer.getElementsByClassName('r5mFeedback__text')[0];
    // 	// feedback.setText(commentsTextElem, defaultText);
    // } catch (err) {
    // 	console.error(err);
    // }
  };

  return new r5mDimmer();
});
