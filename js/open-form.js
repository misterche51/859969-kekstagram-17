'use strict';
// модуль работы с формой
(function () {
  /** разрешенная длиная текста */
  var ALLOWED_TEXT_LENGHT = 140;
  /** стандартное значение value у input.effect-level__value */
  var FILTER_DEFAULT_VALUE = 100;
  /** максимальное количество хэштегов */
  var MAX_HASHTAGS = 5;
  /**
   * @description объект со значениями ограничений длины одного хештега
   * @prop {Number} MIN -- минимальный предел
   * @prop {Number} MAX -- максимальный предел
   *
   */
  var HASHTAG_LENGTH = {
    MIN: 1,
    MAX: 20,
  };
  /** input type="file" для загрузки изображений в сервис */
  var inputPhoto = document.querySelector('#upload-file');
  /** div с элементами для редактирования загруженного файла */
  var photoCorrectionForm = document.querySelector('.img-upload__overlay');
  /** кнопка закрыть окно */
  var buttonClose = photoCorrectionForm.querySelector('.img-upload__cancel');
  /** textarea ввод комментария при загрузке фото */
  var textAreaComment = photoCorrectionForm.querySelector('.text__description');
  /** шкала изменения глубины фильтрации */
  var filterRange = photoCorrectionForm.querySelector('.img-upload__effect-level');
  /** div - поплавок */
  var filterPin = photoCorrectionForm.querySelector('.effect-level__pin');
  /** input с value - значение глубины фильтра */
  var filterValue = photoCorrectionForm.querySelector('.effect-level__value');
  /** ul-список, хранящий в себе inputы выбора фильтров */
  var filterList = photoCorrectionForm.querySelector('.effects__list');
  /** div с фото */
  var image = photoCorrectionForm.querySelector('.img-upload__preview ');
  /** переменная хранит название фильтра */
  var currentEffectName = null;
  /** button type="button" уменьшает масштаб */
  var scaleControlSmaller = photoCorrectionForm.querySelector('.scale__control--smaller');
  /** button type="button" увеличивает масштаб */
  var scaleControlBigger = photoCorrectionForm.querySelector('.scale__control--bigger');
  /** полоса, отображающая глубину эффекта */
  var effectLine = filterRange.querySelector('.effect-level__depth');
  /** поле ввода хэштегов */
  var inputHashtags = photoCorrectionForm.querySelector('.text__hashtags');

  var form = document.querySelector('.img-upload__form');

  var scaleControlSmallerHandler = function () {
    return window.scale.smaller(image);
  };

  var scaleControlBiggerHandler = function () {
    return window.scale.bigger(image);
  };

  var clearTextInput = function (input) {
    input.value = '';
  };

  /**
   * в завиисимости от разрешенной длины текста меняет цвет поля
   * @param {Element} element ссылка на dom-элемент
   */
  var validateTextLength = function () {
    if (textAreaComment.value.length === ALLOWED_TEXT_LENGHT) {
      textAreaComment.style.background = 'red';
    } else {
      textAreaComment.removeAttribute('style');
    }
  };
  /** закрытие при нажатии на esc
   * @param {evt} evt
  */
  var escapeKeydownHandler = function (evt) {
    if (window.utils.isEscPressed(evt)
      && evt.target.type !== 'textarea'
      && !evt.target.classList.contains('text__hashtags')) {
      closeForm();
    }
  };

  var isHashtag = function (el) {
    return el.charAt(0) === '#';
  };

  var isTooShort = function (el) {
    return el.length > HASHTAG_LENGTH.MIN;
  };

  var isTooBig = function (el) {
    return el.length < HASHTAG_LENGTH.MAX;
  };

  var isHashtagRepeat = function (arr) {
    var hashtags = arr.slice(0);
    var hashtagsMap = {};
    var result = true;
    for (var i = 0; i < hashtags.length; i++) {
      var element = hashtags[i].toLowerCase();
      hashtagsMap[element] = !hashtagsMap[element] ? 1 : hashtagsMap[element] + 1;
      if (hashtagsMap[element] > 1) {
        result = false;
        break;
      }
    }
    return result;
  };

  var inputHashtagsValidationHandler = function () {
    var hashtags = inputHashtags.value.split(' ').filter(Boolean);
    if (hashtags.length > MAX_HASHTAGS) {
      inputHashtags.setCustomValidity('Хештегов не должно быть больше 5');
      return;
    }
    if (!isHashtagRepeat(hashtags)) {
      inputHashtags.setCustomValidity('Хештеги не должны повторяться');
      return;
    }
    for (var i = 0; i < hashtags.length; i++) {
      if (!isHashtag(hashtags[i])) {
        inputHashtags.setCustomValidity('Хештег должен начинаться с #');
        return;
      }
      if (!isTooShort(hashtags[i])) {
        inputHashtags.setCustomValidity('Хештег должен быть длиннее чем 1 символ #');
        return;
      }
      if (!isTooBig(hashtags[i])) {
        inputHashtags.setCustomValidity('Превышена максимальная длина хештега (20 символов)');
        return;
      }
    }
    inputHashtags.setCustomValidity('');
  };

  form.addEventListener('submit', function (evt) {
    window.sendmessage(evt, form, photoCorrectionForm);
  });

  /** закрывает окно редактирования фотографии */
  var closeForm = function () {
    photoCorrectionForm.classList.add('hidden');
    inputPhoto.value = null;
    filterList.removeEventListener('change', filterHandler);
    filterPin.removeEventListener('mousedown', filterPinMouseDownHandler);
    textAreaComment.removeEventListener('input', validateTextLength);
    inputHashtags.removeEventListener('change', inputHashtagsValidationHandler);
    document.removeEventListener('keydown', escapeKeydownHandler);
    scaleControlSmaller.removeEventListener('click', scaleControlSmallerHandler);
    scaleControlBigger.removeEventListener('click', scaleControlBiggerHandler);
  };

  /** сбрасывает значение фильтра к стандартному */
  var resetFilterValue = function () {
    filterValue.setAttribute('value', FILTER_DEFAULT_VALUE);
  };
  /** убирает все лишние классы с фото */
  var resetImageClassList = function () {
    image.classList = 'img-upload__preview';
  };
  /** удаляет стиль фильтра у фото */
  var deleteImageInlineStyle = function () {
    image.removeAttribute('style');
  };
  /**
   * функция подставляет css свойство к изобржению в соответствии с выбранным фильтром
   * @param {Number} prop отношение расположеня пина к длине шкалы
   */
  var switcher = function (prop) {
    switch (currentEffectName) {
      case 'chrome':
        image.style.filter = 'grayscale(' + prop + ')';
        break;
      case 'sepia':
        image.style.filter = 'sepia(' + prop + ')';
        break;
      case 'marvin':
        image.style.filter = 'invert(' + prop * 100 + '%)';
        break;
      case 'phobos':
        image.style.filter = 'blur(' + (3 * prop).toFixed(2) + 'px)';
        break;
      case 'heat':
        image.style.filter = 'brightness(' + (1 + 2 * prop) + ')';
        break;
      default:
        image.removeAttribute('style');
    }
  };
  /** общий сброс стилей с фото */
  var rebootFilter = function () {
    image.removeAttribute('style');
    resetFilterValue();
    resetImageClassList();
    deleteImageInlineStyle();
    filterPin.style.left = filterPin.parentNode.offsetWidth + 'px';
    effectLine.style.width = filterPin.parentNode.offsetWidth + 'px';
  };
  /**
   * в зависимости от того, какой фильтр (input) был выбран,
   * блоку image присваивается соответствующий класс, а также показывается или нет (блок с if)
   * шкала глубины фильтрации
   * также происхоидт вызов filterRebeeot, для обнуления значений от предыдущей фильтрации
   * @param {evt} evt предполагается change на input type=radio
   */
  var filterHandler = function (evt) {
    var value = evt.target.value;
    // в зависимости от фильтра показываем или нет шкалу глубины фильтрации
    if (value === 'none') {
      filterRange.classList.add('hidden');
    } else {
      filterRange.classList.remove('hidden');
    }
    rebootFilter();
    /** новый класс в зависимости от значиния выбранного инпута */
    var className = 'effects__preview--' + value;
    image.classList.add(className);
    currentEffectName = value;

    var prop = FILTER_DEFAULT_VALUE / 100;
    switcher(prop);
  };
  var filterPinMouseDownHandler = function (downEvt) {
    downEvt.preventDefault();
    /** берем начальные координаты при взаимодействии с элементом */
    var startPosition = downEvt.clientX;
    var filterLineWidth = filterPin.parentNode.offsetWidth;
    var value = (filterPin.offsetLeft / filterLineWidth).toFixed(2) * 100;
    filterValue.setAttribute('value', value);
    var prop = value / 100;
    switcher(prop);

    var filterPinMouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var valueAtMoveMoment = (filterPin.offsetLeft / filterLineWidth).toFixed(2) * 100;
      filterValue.setAttribute('value', valueAtMoveMoment);
      var propAtMoveMoment = valueAtMoveMoment / 100;
      switcher(propAtMoveMoment);
      /** ищем перемещение */
      var shift = startPosition - moveEvt.clientX;
      /** помещаем новые координаты в старт */
      startPosition = moveEvt.clientX;
      /** вычисляем новое положение */
      var newPinPosition = filterPin.offsetLeft - shift;
      /** проверка на НЕправильность */
      var isInvalidNewPinPosition = newPinPosition < 0 || newPinPosition > filterLineWidth;
      if (isInvalidNewPinPosition) {
        filterPin.style.left = filterPin.style.left + 'px';
        effectLine.style.width = effectLine.style.width + 'px';
      } else {
        filterPin.style.left = newPinPosition + 'px';
        effectLine.style.width = newPinPosition + 'px';
      }
    };

    var filterPinMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      var valueAtUpMoment = (filterPin.offsetLeft / filterLineWidth).toFixed(2) * 100;
      filterValue.setAttribute('value', valueAtUpMoment);
      var propAtUpMoment = valueAtUpMoment / 100;
      switcher(propAtUpMoment);
      filterPin.removeEventListener('mousemove', filterPinMouseMoveHandler);
      filterPin.removeEventListener('mouseup', filterPinMouseUpHandler);
    };
    filterPin.addEventListener('mousemove', filterPinMouseMoveHandler);
    filterPin.addEventListener('mouseup', filterPinMouseUpHandler);
  };

  buttonClose.addEventListener('click', closeForm);

  /** открывает окно редактирования фотографии и вешает прослушку на нажатие esc для закрытия */
  window.openForm = function () {
    clearTextInput(inputHashtags);
    clearTextInput(textAreaComment);
    photoCorrectionForm.classList.remove('hidden');
    filterList.addEventListener('change', filterHandler);
    filterRange.classList.add('hidden');
    filterPin.addEventListener('mousedown', filterPinMouseDownHandler);
    textAreaComment.addEventListener('input', validateTextLength);
    inputHashtags.addEventListener('change', inputHashtagsValidationHandler);
    document.addEventListener('keydown', escapeKeydownHandler);
    scaleControlSmaller.addEventListener('click', scaleControlSmallerHandler);
    scaleControlBigger.addEventListener('click', scaleControlBiggerHandler);
    window.scale.reset(image);
    rebootFilter();
  };
})();
