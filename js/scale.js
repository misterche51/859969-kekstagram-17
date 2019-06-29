'use strict';
//  Модуль для изменения масштаба
(function () {

  /**
   * @description объект со значениями масштаба для фото
   * @prop {Number} MIN -- минимальный предел
   * @prop {Number} MAX -- максимальный предел
   */
  var SCALE_OF_PHOTO = {
    MIN: 25,
    MAX: 100
  };
  /** шаг изменения масштаба */
  var STEP_OF_SCALE = 25;

  /** input type="text" отоборажает масштаб в % */
  var scaleValue = document.querySelector('.scale__control--value');

  /** изменяет значение стилей, меняя масштаб фото
  *  @param {Element} scalableFigure объект масштабирования
  */
  var scalingPhoto = function (scalableFigure) {
    scalableFigure.style.transform = 'scale(' + parseInt(scaleValue.value, 10) / 100 + ')';
  };

  /** уменьшает масштаб у фото, отображая значение в инпуте
  *  @param {Element} scalableFigure объект масштабирования
  */
  var scaleControlSmallerClickHandler = function (scalableFigure) {
    if (scaleValue.value !== SCALE_OF_PHOTO.MIN + '%') {
      scaleValue.value = parseInt(scaleValue.value, 10) - STEP_OF_SCALE + '%';
      scalingPhoto(scalableFigure);
    }
  };

  /** @description уменьшает масштаб у фото, отображая значение в инпуте
  * @param {Element} scalableFigure объект масштабирования
  */
  var scaleControlBiggerClickHandler = function (scalableFigure) {
    if (scaleValue.value !== SCALE_OF_PHOTO.MAX + '%') {
      scaleValue.value = parseInt(scaleValue.value, 10) + STEP_OF_SCALE + '%';
      scalingPhoto(scalableFigure);
    }
  };

  // экспортирую методы в глобальную облатсь видимости
  window.scale = {
    smaller: scaleControlSmallerClickHandler,
    bigger: scaleControlBiggerClickHandler,
  };
})();
