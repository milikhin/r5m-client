define([
  'vendor/qwest/qwest.min',
  'r5m/modules/r5mDimmer/controller'
], function(xhr, dimmer) {
  'use strict';

  function FeedbackController() {
    // this.formElem = formElem;
    this._service = 'formspree';
    if (window.r5m && window.r5m.app.FEEDBACK_SERVICE) {
      this._service = window.r5m.app.FEEDBACK_SERVICE;
    }
  }

  FeedbackController.prototype.init = function() {
    [].forEach.call(document.querySelectorAll('.r5mFeedback__form'), function(formElem) {
      this._addModernPlaceholderHandler(formElem);
      this._addSubmitHandler(formElem);

    }, this);

    // Masker(document.querySelectorAll('[name="phone"]')).maskPattern("(999) 999-9999");

    // [].forEach.call(document.querySelectorAll('[name="phone"]'), function(elem) {
    //
    //   // new Formatter(elem, {
    //   //   'pattern': '+7({{999}})-{{999}}-{{9999}}',
    //   //   'persistent': true
    //   // });
    //   // window.scrollTo(0, 0);
    // });
  };

  FeedbackController.prototype._disableSubmit = function(form) {
    try {
      var submitElem = form.getElementsByClassName('submit-button')[0];
      submitElem.disabled = true;
      submitElem.dataset.value = submitElem.innerHTML;
      submitElem.innerHTML = 'Подождите пожалуйста...';
    } catch (err) {
      console.log(err);
    }
  };

  FeedbackController.prototype._enableSubmit = function(form) {
    try {
      var submitElem = form.getElementsByClassName('submit-button')[0];
      submitElem.disabled = false;
      if (submitElem.dataset.value) {
        submitElem.innerHTML = submitElem.dataset.value;
      }
    } catch (err) {
      console.log(err);
    }
  };

  FeedbackController.prototype._addSubmitHandler = function(form) {
    var self = this;

    form.onsubmit = function() {
      var data = {};
      self._disableSubmit(form);
      [].forEach.call(form, function(field) {
        var name = field.getAttribute('name');
        if (form[name]) {
          data[name] = form[name].value;
        }
      });

      self._reachYandexGoal(form.dataset.metrikaGoal);

      self.send(data).then(function() {
        self._showSuccessDialog(form, form.dataset.next || 'thanks');
        self._enableSubmit(form);
      }, function() {
        self._showSuccessDialog(form, form.dataset.oops || 'oops');
        self._enableSubmit(form);
      });

      return false;
    };
  };

  FeedbackController.prototype.send = function(data) {
    if (!data) {
      throw new Error('Data required to send message');
    }
    // console.log(this._service, data);
    // return;


    switch (this._service) {
      case 'emailjs':
        {
          try {
            return window.emailjs.send("info", window.r5m.app.FEEDBACK_TEMPLATE, data);
          } catch (err) {
            console.log('error sending with emailjs.com');
          }

          break;
        }

      case 'formspree':
        {
          data._subject = 'Сообщение на сайте';
          return xhr.post('https://formspree.io/' + (window.r5m.app.FEEDBACK_EMAIL || 'milikhin@gmail.com'), data, {
            cache: true,
            headers: {
              'Accept': 'application/json'
            }
          });

          break;
        }
      case 'ownmail':
      default:
        {
          return xhr.post('/feedback/call', data, {
            headers: {
              'Accept': 'application/json'
            }
          });
        }
    }
  };

  FeedbackController.prototype._getMessage = function(data) {
    if (!data) {
      throw new Error('Data required to generate message');
    }
    var content = '';
    for (var i in data) {
      content += '<li>' + data[i] + '</li>';
    }

    return '\
			<p>Это сообщение было сформировано с помощью формы обратной связи на сайте.</p>\
			<ul>\
				' + content + '\
			</ul>\
		';
  };

  FeedbackController.prototype._showSuccessDialog = function(form, type) {
    // console.log(form, type);
    dimmer.showDimmer(form, type);
  };

  FeedbackController.prototype._addModernPlaceholderHandler = function(form) {
    var self = this;

    form.addEventListener('input', function(e) {
      self._setupPlaceholder(e.target);
    });

    setTimeout(function() {
      [].forEach.call(form.getElementsByTagName('textarea'), self._setupPlaceholder);
      [].forEach.call(form.getElementsByTagName('input'), self._setupPlaceholder);
    }, 0);
  };

  FeedbackController.prototype._setupPlaceholder = function(target) {
    if (target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
      return;
    }
    if (target.parentNode.tagName != 'LABEL') {
      return;
    }
    var modernPlaceholder = target.parentNode.getElementsByClassName('r5mFeedback__placeholder')[0];
    if (!modernPlaceholder) return;

    if (target.value) {
      target.classList.add('r5mFeedback__input-with-modern-placeholder');
      modernPlaceholder.classList.add('r5mFeedback__placeholder-top');
    } else {
      target.classList.remove('r5mFeedback__input-with-modern-placeholder');
      modernPlaceholder.classList.remove('r5mFeedback__placeholder-top');
    }
  };

  FeedbackController.prototype._resetFormValue = function(form) {
    var self = this;
    form.reset();

    [].forEach.call(form.getElementsByTagName('textarea'), self._setupPlaceholder);
    [].forEach.call(form.getElementsByTagName('input'), self._setupPlaceholder);
  };

  FeedbackController.prototype._reachYandexGoal = function(goalName) {
    //нужно убедиться что метрика точно есть и что цель точно есть
    try {
      var metrikaConf = window.r5m.yandex;
      // console.log("yaCounter" + metrikaConf.COUNTER_ID);
      window["yaCounter" + metrikaConf.COUNTER_ID].reachGoal(goalName || metrikaConf.DEFAULT_GOAL);
    } catch (e) {
      console.log('Error in metrika', e);
    }

  };

  return new FeedbackController();
});
