define([
    'r5m/modules/lib/closest',
    'r5m/modules/lib/custom-event',
    'r5m/modules/lib/dataset',
    'r5m/modules/page/controller',
    'r5m/modules/r5mDimmer/controller',
    'r5m/modules/feedback/controller',
    'r5m/modules/gallery/controller',
    'r5m/modules/utm-content/controller',
    'r5m/modules/carousel/controller',
    'r5m/modules/menu-highlighter/controller'

], function(applyClosestPolyfill, applyCustomEventPolyfill) {

    return function(modules) {
        var activeModules = [];
        applyClosestPolyfill(window.Element.prototype);
        applyCustomEventPolyfill(window);

        if (!modules) {
            return;
        }

        modules.forEach(function(moduleName) {
            if (moduleName.indexOf('app/') == 0) {
                require([moduleName + "/controller"], loadModule);
            } else {
                require(['r5m/modules/' + moduleName + '/controller'], loadModule);
            }

            function loadModule(moduleClass) {
                if (!~activeModules.indexOf(moduleClass)) {
                    activeModules.push(moduleClass);
                    try {
                        moduleClass.init();
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
        });

        //обработчик на весь документ. Нас интересуют только элементы с data-action, по которым мы поймем, какой модуль с каким action вызвать. Например 'tour-create'
        document.addEventListener('click', function(e) {
            var target;

            if (e.target.dataset && e.target.dataset.action) {
                target = e.target;
            } else {
                target = e.target.closest('.r5m-action');
            }

            if (!target) {
                return;
            }

            var action = target.dataset.action;
            // Отметаем все без data-action
            if (!action || (typeof(action) != 'string')) return;

            // разбиваем по тире на [модуль, действие]. Если не вышло - в топку
            var moduleAction = action.split('__');
            if (moduleAction.length < 2) return;

            if(!target.dataset.actionDefault) {
              e.preventDefault();
            } else {
              // e.preventDefault();
              // e.stopPropagation();
            }
            console.log(moduleAction, activeModules);
						// console.log(activeModules.map(function(m) {return m.title;}));
            activeModules.forEach(function(module) {
                if (moduleAction[0] == module.title && module.clickHandler) {
                    module.clickHandler(moduleAction[1], target); //передаем только action в модуль
                }
            });
        });
    };
});
