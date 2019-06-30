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
  /** навешиваемся на кнопку, чтобы открыть форму изменения загружаемого фото */
  inputPhoto.addEventListener('change', window.form.open);

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
 * @callback function(galleryItems)
 * @param {Array} galleryItems -- данные с сервера в формате массива объектов
 */
  window.load(function (galleryItems) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < COUNT_OF_PHOTOS; i++) {
      fragment.appendChild(renderItem(galleryItems[i]));
    }
    container.appendChild(fragment);
  });
})();
