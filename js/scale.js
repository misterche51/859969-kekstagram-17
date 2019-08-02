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
  var inputScaleValue = document.querySelector('.scale__control--value');

  /** изменяет значение стилей, меняя масштаб фото
  *  @param {Element} scalableFigure объект масштабирования
  */
  var scalePhoto = function (scalableFigure) {
    scalableFigure.style.transform = 'scale(' + parseInt(inputScaleValue.getAttribute('value'), 10) / 100 + ')';
  };

  /** уменьшает масштаб у фото, отображая значение в инпуте
  *  @param {Element} scalableFigure объект масштабирования
  */
  var scaleControlSmallerClickHandler = function (scalableFigure) {
    if (inputScaleValue.value !== SCALE_OF_PHOTO.MIN + '%') {
      var value = parseInt(inputScaleValue.value, 10) - STEP_OF_SCALE + '%';
      inputScaleValue.setAttribute('value', value);
      scalePhoto(scalableFigure);
    }
  };

  /** @description уменьшает масштаб у фото, отображая значение в инпуте
  * @param {Element} scalableFigure объект масштабирования
  */
  var scaleControlBiggerClickHandler = function (scalableFigure) {
    if (inputScaleValue.value !== SCALE_OF_PHOTO.MAX + '%') {
      var value = parseInt(inputScaleValue.value, 10) + STEP_OF_SCALE + '%';
      inputScaleValue.setAttribute('value', value);
      scalePhoto(scalableFigure);
    }
  };
  /** сбрасывает масштабирование на дефолтный уровень
   * @param {Element} scalableFigure объект масштабирования
  */
  var resetScale = function (scalableFigure) {
    inputScaleValue.setAttribute('value', SCALE_OF_PHOTO.MAX + '%');
    scalableFigure.removeAttribute('style');
  };

  // экспортирую методы в глобальную облатсь видимости
  window.scale = {
    smaller: scaleControlSmallerClickHandler,
    bigger: scaleControlBiggerClickHandler,
    reset: resetScale,
  };
})();
