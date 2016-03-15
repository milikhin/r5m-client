# r5m-client

Кучка клиентских модулей для простого сайта.
* [Карусель](#carousel)
* [Формы обратной связи](#feedback)
* [Галерея](#gallery)
* [Страницы и DOM](#page)
* [Dimmer](#r5mdimmer)
* [Транслитерация](#trans)

## Активные проекты ##

### v0.0.6 ###
* *julistudio.ru*, emailjs
* *interior-nk.ru*, formspree
* *cko-sb.ru*, emailjs
* *r5m.me*, formspree

### v0.0.3 ###
* *ckb-nk.ru*, emailjs
   TODO: перевести на v0.0.4+


## Модули ##
### Carousel ###
Простая карусель. 

#### API ####
Инициализируется автоматически для всех элементов с классом ```.carousel```

Верстка
```
<div class="carousel">
  <ul>
    <li> Слайд 1</li>
    <li> Слайд 2</li>
    ...
  </ul>
</div>
```

Создание вручную:
```
new Carousel(elem, options)
// options.elem
// options.rounded = true/false - активировать зацикливание карусели, по умолчанию true.
```

Методы:
* moveLeft() - сдвинуть на слайд влево (если возможно)
* moveRight() - сдвинуть на слайд вправо (если возможно)
* moveToSlide(num) - перейти к слайду с определенным номером

#### Фишки ####
* Это адаптивная карусель, которая адекватно реагирует на изменение размера корневого элемента (в рамках window.onresize)
* Высота карусели равна максимальной высоте ее слайдов

### Feedback ###
Автоматически добавляет для всех форм с классом ```r5mFeedback__form``` Tinkoff-like поведение полей ввода и вешает обработчик на событие *submit* формы.

Используемый сервис для отправки сообщений определяется в ```window.r5m.app.FEEDBACK_SERVICE```. По умолчанию - *formspree*

#### Фишки ####
Расширяемость. Сейчас реализованы два механизма доставки сообщений: *formspree* и *emailjs.com*

### Gallery ###
Немного запутанная штука. 

Автоматически преобразует в галерею вот таку верстку:
```
<a class="r5m-gallery-link" rel="gr-reviews" href="#">
  <figure 
    class="r5m-gallery-img" 
    data-alt="Подпись к картинке" 
    data-href="path/to/full-size/image" 
    data-file-name="cert-1.jpg">
      <img src="images/cert-1s.jpg" alt="Подпись к картинке" />
      <figcaption>...</figcaption>
  </figure>
</a>
```
То есть у ссылки, по нажатию которой открывается полноразмерное изображение должен быть класс ```r5m-gallery-link```.
Атрибуты ссылки:
* rel - Используется для объекдинения изображений в группы (изображения с одинаковым rel будут сменяться при нажатии на кнопки "влево"/"вправо").

Само изображение описывается элементом с классом ```r5m-gallery-img```. Атрибуты изображения:
* data-alt - Подпись в Галереи
* data-href - Изображение, которое будет показано (полноразмерная версия картинки)
* data-file-name - не помню.

Вручную можно инициализировать как ```new GalleryUi(imgClass, linkClass).init()```

#### Фишки ####
* Поддерживается управление с клавиатуры: *стрелки + Esc*. 
* Поддерживается объединение произвольного количества картинок в группы
* Подписи к изображениям

### Helper ###

### Page ###
Пока один единственный метод *removeDOM* - удаляет текущий DOM-элемент.

### R5mDimmer ###

### Trans ###
Транслитерация. Возвращает функцию, которая преобразует строку на кириллице в транслит в нижнем регистре. Пробельные и другие нелепые символы заменяются на "_"

```
trans('Пример транслитерации') // "primer_transliteratsii"
```
