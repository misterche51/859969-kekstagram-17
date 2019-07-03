'use struct';
//мудуль отрисовки данных с сервера
(function () {
  /** контейнер для вставки данных */
  var container = document.querySelector('.pictures');
  // /** количество генерируемых объектов-фото */
  // var COUNT_OF_PHOTOS = 25;
  /** шаблон */
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

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

    window.render = function (data) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < data.length; i++) {
        fragment.appendChild(renderItem(data[i]));
      }
      container.appendChild(fragment);
    };


})();
