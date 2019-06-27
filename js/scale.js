'use strict';
//  Модуль для генерации моков
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

  /** div с элементами для редактирования загруженного файла */
  var form = document.querySelector('.img-upload__overlay');

  /** div с фото */
  var image = form.querySelector('.img-upload__preview ');

  /** input type="text" отоборажает масштаб в % */
  var scaleValue = form.querySelector('.scale__control--value');

  /** button type="button" уменьшает масштаб */
  var scaleControlSmaller = form.querySelector('.scale__control--smaller');

  /** button type="button" увеличивает масштаб */
  var scaleControlBigger = form.querySelector('.scale__control--bigger');

  /** изменяет значение стилей, меняя масштаб фото*/
  var scalingPhoto = function () {
    image.style.transform = 'scale(' + parseInt(scaleValue.value, 10) / 100 + ')';
  };

  /** уменьшает масштаб у фото, отображая значение в инпуте */
  var scaleControlSmallerClickHandler = function () {
    if (scaleValue.value !== SCALE_OF_PHOTO.MIN + '%') {
      scaleValue.value = parseInt(scaleValue.value, 10) - STEP_OF_SCALE + '%';
      scalingPhoto();
    }
  };

  /** @description уменьшает масштаб у фото, отображая значение в инпуте */
  var scaleControlBiggerClickHandler = function () {
    if (scaleValue.value !== SCALE_OF_PHOTO.MAX + '%') {
      scaleValue.value = parseInt(scaleValue.value, 10) + STEP_OF_SCALE + '%';
      scalingPhoto();
    }
  };

  scaleControlSmaller.addEventListener('click', scaleControlSmallerClickHandler);
  scaleControlBigger.addEventListener('click', scaleControlBiggerClickHandler);
})();
