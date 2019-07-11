'use strict';
//  мудуль отрисовки данных с сервера
(function () {
  /** контейнер для вставки данных */
  var container = document.querySelector('.pictures');
  /** шаблон */
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  /**
  * @description создает фрагмент на странице и наполнять его заполненными клонами
  * @param {Object} item
  * @param {Number} index
  * @return {Element}
  */
  var renderItem = function (item, index) {
    var newPicture = pictureTemplate.cloneNode(true);
    newPicture.querySelector('.picture__img').src = item.url;
    newPicture.querySelector('.picture__img').dataset.index = index;
    newPicture.querySelector('.picture__comments').textContent = item.comments.length;
    newPicture.querySelector('.picture__likes').textContent = item.likes;

    return newPicture;
  };

  window.render = function (data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      fragment.appendChild(renderItem(item, i));
    }
    container.appendChild(fragment);
  };
})();
