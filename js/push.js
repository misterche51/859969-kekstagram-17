'use strict';
//  Модуль для вставки подготовленных ранее данных в HTML
(function () {

  /** шаблон */
  var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');
  /**
   * @description создает фрагмент на странице и наполнять его заполненными клонами
   * @param {Array} items
   * @return {Element}
   */
  var createFragment = function (items) {
    var newFragment = document.createDocumentFragment();
    for (var i = 0; i < items.length; i++) {
      var newPicture = pictureTemplate.cloneNode(true);
      newPicture.querySelector('.picture__img').src = items[i].url;
      newPicture.querySelector('.picture__comments').textContent = items[i].comments.length;
      newPicture.querySelector('.picture__likes').textContent = items[i].likes;
      newFragment.appendChild(newPicture);
    }
    return newFragment;
  };

  //  экспортирую метод в глобальную область видимости
  window.push = {
    createFragment:createFragment
  };
})();
