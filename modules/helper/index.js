define(["dijit/Tooltip"], function(Tooltip) {

    /*
  есть 5 методов уведомлений:
    info    - голубой цвет  - простая информация в виде "Информация: текст..."
    success - зеленый цвет  - Успешное выполнение в виде "Выполнено: текст..."
    warning - желтый цвет   - Предупреждение или "внимание"  - "Внимание: текст..."
    debug   - белый цвет    - для разработчиков - "Отладка: текст..."
    error   - красный цвет  - Не дай бог увидеть... - "Ошибка: текст..."

  и метод, закрывающий уведомление принудительно
    hide - (без параметров) закрывает уведомления

  Можно вызвать и промежуточные методы, если это прям необходимо
    show(тип сообщения, таймаут) - покажет последнее сообщение, независимо от типа (info, success, ...).
                                  Если нет таймаута, то значение по умолчанию
    hideOnTiomeout(timeout) - скроет сообщение через указанное в милисекундах время

======================================================================================
  Каждое уведомление вызывается в виде Helper.метод(message [, timeout]),
    где метод - это один из 5-и видов уведомлений
    message - сообщение, выводимое на экран. В теории можно передавать с HTML тегами, насколько все "съедет" не знаю
    timeout - опциональный параметр, указывающий через какое время скрыть уведомление.
              Задается в милисекундах. Если не задан, то берется значение по умолчанию 10000 (10сек.)

    Helper.hide() вызывается без параметров

    Пример использования:
    подключаем "wgs45/controllers/helper" как, например, Helper.
    Далее Helper.метод(сообщение, таймер), методы описаны выше, например
        Helper.info("Всего 1450 записей") - закроется по-умолчанию через 10 секунд
        Helper.info("Всего 1450 записей", 3000) - закроется через 3 секунды

    Зыкрыть можно принудительно, вызвав метод Helper.hide() без параметров.
    Если нужно, чтобы уведомление не закрывалось то вызова метода hide более чем 10 секунд, то
    можно вызвать метод и передать timeout много больше 10000, чтобы до вызова метода hide он не успел сработать.
      TODO параметр таймаута нужно сделать возможным unlimited...


Убирать Helper можно 4-мя способами:
1. Вызвать новый Helper, тогда старый убирается
2. Передать при вызове Hepler время в милисекундах, через которое мы хотим скрыть сообщение
3. Вызвать Helper.hide(), который закроет текущее сообщение
4. По умолчанию, через <this.timeout> секунд он закроется сам.

Так же там ведутся логи текущего объекта Helper. В перспективе с помощью них можно показать где-нибудь все сообщения, которые были, даже применяя фильтры (например показать только debug). Также в перспективе можно все ошибки упаковывать в сообщения и посылать разработчику)
Еще легко можно сделать, чтобы debug информация записывалась в логи объекта, но не выводилась на экран. Таким образом можно в каждом модуле весьма детально отлавливать действия пользователя, собирать их, и по требованию (например при ошибке) отправлять разработчику со списком того, что делал пользователь перед ошибкой и с информацией об ошибке. Такая неявная скрытая функция аудита может очень легко получиться, если я посижу над штукой еще пару дней)
 */

    function Helper(options) {
        this.message = null;
        this.log = [];
        this.timer = null;

        this.timeout = options.timeout || 3000;
        this.position = options.position || ['below'];
        this.messages = options.messages || {};
    }


    Helper.prototype.info = function(message, timeout) {
        //   message = '<i class="fa fa-info-circle" style="color:#afeeee"> <b>Информация:</b> </i> '+message;
        message = '<i class="fa fa-info-circle"></i> ' + message;
        this.message = message ? message : "null";
        this.show('info', timeout);
    };

    Helper.prototype.success = function(message, timeout) {
        //message = '<i class="fa fa-check-circle" style="color:#90ee90"> <b>Выполнено:</b> </i> ' + message;
        message = '<i class="fa fa-check-circle"></i> ' + message;

        this.message = message ? message : "null";
        this.show('success', timeout);
    };

    Helper.prototype.warning = function(message, timeout) {
        message = '<i class="fa fa-exclamation-triangle" style="color:#f0e68c"> <b>Внимание:</b> </i> ' + message;
        this.message = message ? message : "null";
        this.show('warning', timeout);
    };

    Helper.prototype.debug = function(message, timeout) {
        message = '<i class="fa fa-cogs" style="color:#F5F5F5"> <b>Отладка:</b> </i> ' + message;
        this.message = message ? message : "null";
        this.show('debug', timeout);
    };

    Helper.prototype.error = function(message, timeout) {
        message = '<i class="fa fa-times-circle" style="color:#f08080"> <b>Ошибка:</b> </i> ' + message;
        this.message = message ? message : "null";
        this.show('error', timeout);
    };

    Helper.prototype.show = function(type, timeout) {
        var self = this;
        this.doLogging(type); //логируеи действие
        self.hide(); // скрываем текущее уведомление

        Tooltip.show(self.message, document.getElementById('helper-container'), this.position); //показываем
        this.hideOnTiomeout(timeout); //устанавливаем таймер
        // TODO если параметр "бесконечный", то не устранавливаем таймер
    };

    Helper.prototype.hide = function(/*notification*/) {
        if (this.timer) { //обнуляем текущий таймер, чтобы он не скрыл нам новое уведомление
            clearTimeout(this.timer);
            this.timer = null;
        }
        Tooltip.hide(document.getElementById('helper-container'));
    };

    Helper.prototype.doLogging = function(type) {
        this.log.push(type + " : " + this.message);
    };

    Helper.prototype.hideOnTiomeout = function(timeout) {
        var self = this;
        if (!timeout || (typeof(timeout) != "number")) {
            timeout = self.timeout;
        }
        this.timer = setTimeout(function() { //запоминаем таймер в объекте
            self.hide();
        }, timeout);
    };


    return Helper;
});
