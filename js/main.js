'use strict';

/** количество генерируемых объектов-фото */
var COUNT_OF_PHOTOS = 25;

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

/**
 * @description объект с диапазоном количество лайков
 * @prop {Number} MIN -- минимальный предел
 * @prop {Number} MAX -- максимальный предел
 */
var LIKES_VALUE = {
  MIN: 15,
  MAX: 100
};

/**
 * @description объект с диапазоном количества комментариев под фото
 * @prop {Number} MIN -- минимальный предел
 * @prop {Number} MAX -- максимальный предел
 */
var COMMENTS_VALUE = {
  MIN: 1,
  MAX: 8
};

/**
 * @description объект с диапазоном индексов для ссылок на фото аватаров комментирующих пользователей
 * @prop {Number} MIN -- минимальный предел
 * @prop {Number} MAX -- максимальный предел
 */
var AVATAR_INDEX = {
  MIN: 1,
  MAX: 6
};

/** names - массив имен для магов */
var names = ['Ватерпежекосма', 'Кукуцаполь', 'Перкосрак', 'Тролебузина', 'Персострат',
  'Нисерха', 'Гус', 'Феопент', 'Сисиний', 'Амфилохий',
  'Ексакустодиан', 'Еразм', 'Логин', 'Никострат', 'Пугилий',
  'Шахроза', 'Валенсия', 'Олимпиада', 'Алладин', 'Кришна'];

/** comments - массив с комментариями */
var comments = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];


/**
 * @description Функция-рандомизатор
 * @param {number} min минимальное значение
 * @param {number} max максимальное значение
 * @return {number} любое целое число из заданного диапазона
 * */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @description функция берет массив и возвращает рандомную строку с именем мага
 * @param {Array} arrOfNames -- ожидается заранее подготовленный массив имен
 * @return {String} имя мага
 */
var getName = function (arrOfNames) {
  return arrOfNames[getRandomNumber(0, arrOfNames.length - 1)];
};


/**
 * @description функция берет массив и возвращает рандомную строку с комментарием
 * @param {arr} arr -- предполагается массив с комментариями
 * @return {String} рандомный комментарий
 */
var getRandomMessage = function (arr) {
  return arr[getRandomNumber(0, arr.length - 1)];
};

/**
 * @description создается массив объектов,
 * каждый из которых содержит данные о пользователе,
 * оставившем комментарий (имя; аватар), и сам комментарий
 * @return {Array} массив объектов
 */
var getArrayOfComments = function () {
  var arrayOfComments = [];
  for (var i = 1; i <= getRandomNumber(COMMENTS_VALUE.MIN, COMMENTS_VALUE.MAX); i++) {
    var commentItem = {
      avatar: 'img/avatar-' + getRandomNumber(AVATAR_INDEX.MIN, AVATAR_INDEX.MAX) + '.svg',
      name: getName(names),
      message: getRandomMessage(comments)
    };
    arrayOfComments.push(commentItem);
  }
  return arrayOfComments;
};

// функция для заполнения массива необходимыми данными
var createGallery = function (countOfPhotos) {
  var gallery = [];
  for (var i = 1; i <= countOfPhotos; i++) {
    var photo = {
      url: 'photos/' + i + '.jpg',
      likes: getRandomNumber(LIKES_VALUE.MIN, LIKES_VALUE.MAX),
      comments: getArrayOfComments()
    };
    gallery.push(photo);
  }
  return gallery;
};


// начинаю работу с DOM

// находим контейнер, куда будем вставлять нагенерированные данные
var container = document.querySelector('.pictures');
// находим шаблон
var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
// создаем функцию, которая будет создавать фрагмент и наполнять его заполненными клонами
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

// вызываем функцию и записываем ее значение для дальнейшенго использования
var photos = createGallery(COUNT_OF_PHOTOS);
// присвоим результат вызова функции в переменную для дальнейшей вставки в html
var fragment = createFragment(photos);
// пушим фрагмент в документ
container.appendChild(fragment);

/** input type="file" для загрузки изображений в сервис */
var inputPhoto = document.querySelector('#upload-file');
/** div с элементами для редактирования загруженного файла */
var photoCorrectionForm = document.querySelector('.img-upload__overlay');
/** кнопка закрыть окно */
var buttonClose = photoCorrectionForm.querySelector('.img-upload__cancel');
/** закрытие при нажатии на esc
 * @param {evt} evt
*/
var escapeKeydownHandler = function (evt) {
  if (evt.keyCode === 27  && evt.target.type !== 'textarea') {
    closeCorrection();
  }
};
/** открывает окно редактирования фотографии и вешает прослушку на нажатие esc для закрытия */
var openCorrection = function () {
  photoCorrectionForm.classList.remove('hidden');
  filterList.addEventListener('change', filterHandler);
  filterRange.classList.add('hidden');
  filterPin.addEventListener('mouseup', filterPinMouseupHandler);
  textAreaComment.addEventListener('input', textAreaIsFullShowMessage);
  document.addEventListener('keydown', escapeKeydownHandler);
};
/** закрывает окно редактирования фотографии */
var closeCorrection = function () {
  photoCorrectionForm.classList.add('hidden');
  inputPhoto.value = null;
  filterList.addEventListener('change', filterHandler);
  filterPin.removeEventListener('mouseup', filterPinMouseupHandler);
  textAreaComment.removeEventListener('input', textAreaIsFullShowMessage);
  document.removeEventListener('keydown', escapeKeydownHandler);
};

// блок масштабирования фотографии

/** input type="text" отоборажает масштаб в % */
var scaleValue = photoCorrectionForm.querySelector('.scale__control--value');
/** button type="button" уменьшает масштаб */
var scaleControlSmaller = photoCorrectionForm.querySelector('.scale__control--smaller');
/** button type="button" увеличивает масштаб */
var scaleControlBigger = photoCorrectionForm.querySelector('.scale__control--bigger');

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

inputPhoto.addEventListener('change', openCorrection);
buttonClose.addEventListener('click', closeCorrection);
scaleControlSmaller.addEventListener('click', scaleControlSmallerClickHandler);
scaleControlBigger.addEventListener('click', scaleControlBiggerClickHandler);

// блок работы с фильтрами

/** шкала изменения глубины фильтрации */
var filterRange = photoCorrectionForm.querySelector('.img-upload__effect-level');
/** div - поплавок */
var filterPin = photoCorrectionForm.querySelector('.effect-level__pin');
/** input с value - значение глубины фильтра */
var filterValue = photoCorrectionForm.querySelector('.effect-level__value');
/** стандартное значеине value у input.effect-level__value */
var FILTER_DEFAULT_VALUE = 100;
/** ul-список, хранящий в себе inputы выбора фильтров */
var filterList = photoCorrectionForm.querySelector('.effects__list');
/** div с фото */
var image = photoCorrectionForm.querySelector('.img-upload__preview ');
/** переменная хранит название фильтра */
var currentEffectName = null;

/** сбрасывает значение фильтра к стандартному */
var filterValueReset = function () {
  filterValue.value = FILTER_DEFAULT_VALUE;
};
/** убирает все лишние классы с фото */
var imageClassListReset = function () {
  image.classList = 'img-upload__preview';
};
/** удаляет стиль фильтра у фото */
var imageInlineStyleDelete = function () {
  image.removeAttribute('style');
};

/** общий сброс стилей с фото */
var filterReboot = function () {
  filterValueReset();
  imageClassListReset();
  imageInlineStyleDelete();
};

/**
 * в зависимости от того, какой фильтр (input) был выбран,
 * блоку image присваивается соответствующий класс, а также показывается или нет (блок с if)
 * шкала глубины фильтрации
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
};

/** вычисляет необходимую глубину фильтрации,
 *  подставляет это значение в input,
 *  преобразует значение глубины в необходимое для каждого фильтра,
 *  вставялет инлай стиль у фото
 * @param {evt} evt -- ожидается mouseup
 */
var filterPinMouseupHandler = function (evt) {
  var filterLineWidth = evt.target.parentNode.offsetWidth;
  var prop = (evt.target.offsetLeft / filterLineWidth).toFixed(2);
  var value = prop * 100;
  filterValue.value = value;

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
  }
};


/** textarea ввод комментария при загрузке фото */
var textAreaComment = photoCorrectionForm.querySelector('.text__description');
/** alert если достигнута maxlength у поля ввода */
var textAreaIsFullShowMessage = function (evt) {
  if (evt.target.value.length == 140) {
    alert("Больше буков низя");
  }
};

