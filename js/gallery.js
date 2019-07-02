'use strict';
// модуль работы с галереей на главной
(function () {
  /** контейнер для вставки данных */
  var container = document.querySelector('.pictures');
  /** количество генерируемых объектов-фото */
  var COUNT_OF_PHOTOS = 25;
  /** шаблон */
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
  /** кнопка загрузки нового изображения */
  var inputPhoto = document.querySelector('#upload-file');

  /**
   * @description создает фрагмент на странице и наполнять его заполненными клонами
   * @param {Object} item
   * @return {Element}
   */
  var renderItem = function (item) {
    var newPicture = pictureTemplate.cloneNode(true);
    newPicture.querySelector('.picture__img').src = item.url;
    newPicture.querySelector('.picture__comments').textContent = item.comments.length;
    newPicture.querySelector('.picture__likes').textContent = item.likes;

    return newPicture;
  };

  /**
  * @param {Array} galleryItems -- данные с сервера в формате массива объектов
  */
  var successHandler = function (galleryItems) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < COUNT_OF_PHOTOS; i++) {
      fragment.appendChild(renderItem(galleryItems[i]));
    }
    container.appendChild(fragment);
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; padding: 50px 0;text-align: center; background-color: red;';
    node.style.position = 'fixed';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.api.load(successHandler, errorHandler);


  /** навешиваемся на кнопку, чтобы открыть форму изменения загружаемого фото */
  inputPhoto.addEventListener('change', window.form.open);
})();
