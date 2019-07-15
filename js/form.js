'use strict';
// модуль работы с формой
(function () {
  /** разрешенная длиная текста */
  var ALLOWED_TEXT_LENGHT = 140;
  /** стандартное значение value у input.effect-level__value */
  var FILTER_DEFAULT_VALUE = 100;
  /** максимальное количество хэштегов */
  var MAX_HASHTAGS = 5;

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

  /**
   * в завиисимости от разрешенной длины текста меняет цвет поля
   * @param {Element} element ссылка на dom-элемент
   */
  var textLenghtValidation = function () {
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
    if (evt.keyCode === 27
      && evt.target.type !== 'textarea'
      && !evt.target.classList.contains('text__hashtags')) {
      close();
    }
  };

  var isHashtag = function (el) {
    return el.charAt(0) === '#';
  };

  var isTooShort = function (el) {
    return el.length > 1;
  };

  var isTooBig = function (el) {
    return el.length < 20;
  };

  var inputHashtagsValidationHandler = function () {
    inputHashtags.setCustomValidity('');
    var hashtagsArr = inputHashtags.value.split(' ');
    var filteredArr = hashtagsArr.filter(Boolean);
    if (filteredArr.length > MAX_HASHTAGS) {
      inputHashtags.setCustomValidity('Хештегов не должно быть больше 5');
      return;
    }
    for (var i = 0; i < filteredArr.length; i++) {
      if (!isHashtag(filteredArr[i])) {
        inputHashtags.setCustomValidity('Хештег должен начинаться с #');
        return;
      }
      if (!isTooShort(filteredArr[i])) {
        inputHashtags.setCustomValidity('Хештег должен быть длиннее чем 1 символ #');
        return;
      }
      if (!isTooBig(filteredArr[i])) {
        inputHashtags.setCustomValidity('Превышена максимальная длина хештега (20 символов)');
        return;
      }
    }
    var lowerCasedArr = filteredArr.map(function (it) {
      return it.toLowerCase();
    }).sort();
    for (var j = 0; j < lowerCasedArr.length; j++) {
      if (lowerCasedArr[j] === lowerCasedArr[j + 1]) {
        inputHashtags.setCustomValidity('Хештеги не должны повторяться');
        return;
      } else {
        inputHashtags.setCustomValidity('');
      }
    }
  };
  /** открывает окно редактирования фотографии и вешает прослушку на нажатие esc для закрытия */
  var open = function () {
    photoCorrectionForm.classList.remove('hidden');
    filterList.addEventListener('change', filterHandler);
    filterRange.classList.add('hidden');
    filterPin.addEventListener('mousedown', filterPinMouseDownHandler);
    textAreaComment.addEventListener('input', textLenghtValidation);
    inputHashtags.addEventListener('change', inputHashtagsValidationHandler);
    document.addEventListener('keydown', escapeKeydownHandler);
  };
  /** закрывает окно редактирования фотографии */
  var close = function () {
    photoCorrectionForm.classList.add('hidden');
    inputPhoto.value = null;
    filterList.removeEventListener('change', filterHandler);
    filterPin.removeEventListener('mousedown', filterPinMouseDownHandler);
    textAreaComment.removeEventListener('input', textLenghtValidation);
    inputHashtags.removeEventListener('change', inputHashtagsValidationHandler);
    document.removeEventListener('keydown', escapeKeydownHandler);
  };
  /** сбрасывает значение фильтра к стандартному */
  var filterValueReset = function () {
    filterValue.setAttribute('value', FILTER_DEFAULT_VALUE);
  };
  /** убирает все лишние классы с фото */
  var imageClassListReset = function () {
    image.classList = 'img-upload__preview';
  };
  /** удаляет стиль фильтра у фото */
  var imageInlineStyleDelete = function () {
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
  var filterReboot = function () {
    image.removeAttribute('style');
    filterValueReset();
    imageClassListReset();
    imageInlineStyleDelete();
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

    filterReboot();
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


  buttonClose.addEventListener('click', close);

  scaleControlSmaller.addEventListener('click', function () {
    window.scale.smaller(image);
  });
  scaleControlBigger.addEventListener('click', function () {
    window.scale.bigger(image);
  });

  var mainContainer = document.querySelector('main');
  var successTemplate = document.querySelector('#success')
      .content
      .querySelector('.success');
  var errorTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');

  var renderMessage = function (template) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(template);
    mainContainer.insertBefore(fragment, mainContainer.firstChild);
  };

  var formSendHandler = function (resultTemplate) {
    photoCorrectionForm.classList.add('hidden');
    renderMessage(resultTemplate);
    var closeMessage = function () {
      mainContainer.removeChild(mainContainer.firstChild);
    };
    var overlay = document.querySelector('section');
    var messageBox = overlay.querySelector('div');
    var button = mainContainer.firstChild.querySelectorAll('button');
    for (var i = 0; i < button.length; i++) {
      button[i].addEventListener('click', closeMessage);
    }
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === 27) {
        closeMessage();
      }
    });
    overlay.addEventListener('click', function (evt) {
      if (evt.target !== messageBox) {
        closeMessage();
      }
    });
  };

  form.addEventListener('submit', function (evt) {
    window.api.upload(new FormData(form),
        function () {
          formSendHandler(successTemplate);
        },
        function () {
          formSendHandler(errorTemplate);
        }
    );
    evt.preventDefault();
  });

  window.form = {
    open: open,
  };


})();
