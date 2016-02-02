define([
	'vendor/qwest/qwest.min',
	'r5m/modules/r5mDimmer/controller'
], function (xhr, dimmer) {
	'use strict';

	function FeedbackController() {
		// this.formElem = formElem;
		this._service = 'formspree';
		if (window.r5m && window.r5m.FEEDBACK_SERVICE) {
			this._service = window.r5m.FEEDBACK_SERVICE;
		}
	}

	FeedbackController.prototype.init = function () {
		[].forEach.call(document.querySelectorAll('.r5mFeedback__form'), function (formElem) {
			this._addModernPlaceholderHandler(formElem);
			this._addSubmitHandler(formElem);
		}, this);
	};

	FeedbackController.prototype._addSubmitHandler = function (form) {
		var self = this;

		form.onsubmit = function () {
			var data = {};
			['name', 'phone', 'email', 'text'].forEach(function (field) {
				if (form[field]) {
					data[field] = form[field].value;
				}
			});
			// xhr.post('feedback', {

			self.send(data).then(function () {
				self._showSuccessDialog(form, 'thanks');
			}, function () {
				self._showSuccessDialog(form, 'oops');
			});

			return false;
		};
	};

	FeedbackController.prototype.send = function (data) {
		if (!data) {
			throw new Error('Data required to send message');
		}

		switch (this._service) {
		case 'emailjs':
			{
				// ...
				break;
			}

		case 'formspree':
		default:
			{
				data._subject = 'Сообщение на сайте';
				return xhr.post('http://formspree.io/milikhin@gmail.com', data, {
					cache: true,
					headers: {
						'Accept': 'application/json'
					}
				});
			}
		}
	};

	FeedbackController.prototype._getMessage = function (data) {
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

	FeedbackController.prototype._showSuccessDialog = function (form, type) {
		console.log(form, type);
		dimmer.showDimmer(form, type);
	};

	FeedbackController.prototype._addModernPlaceholderHandler = function (form) {
		var self = this;

		form.addEventListener('input', function (e) {
			self._setupPlaceholder(e.target);
		});

		setTimeout(function () {
			[].forEach.call(form.getElementsByTagName('textarea'), self._setupPlaceholder);
			[].forEach.call(form.getElementsByTagName('input'), self._setupPlaceholder);
		}, 0);
	};

	FeedbackController.prototype._setupPlaceholder = function (target) {
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

	FeedbackController.prototype._resetFormValue = function (form) {
		var self = this;
		form.reset();

		[].forEach.call(form.getElementsByTagName('textarea'), self._setupPlaceholder);
		[].forEach.call(form.getElementsByTagName('input'), self._setupPlaceholder);
	};

	return new FeedbackController();
});
