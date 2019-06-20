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
/** обертка на загруженную фотку */
var image = photoCorrectionForm.querySelector('.img-upload__preview ');
/** @description при вызове открывает окно редактирования фотографии и вешает прослушку на нажатие esc для закрытия */
var openCorrection = function () {
  photoCorrectionForm.classList.remove('hidden');
  photoCorrectionForm.addEventListener('click', changer);
  document.addEventListener('keydown', escapeKeydownHandler);
};
/** @description функция закрытия при нажатии на esc
 * @param {evt} evt
*/
var escapeKeydownHandler = function (evt) {
  if (evt.keyCode === 27) {
    closeCorrection();
  }
};
/** @description при вызове закрывает окно редактирования фотографии */
var closeCorrection = function () {
  photoCorrectionForm.classList.add('hidden');
  inputPhoto.value = null;
  document.removeEventListener('keydown', escapeKeydownHandler);
};


/** input type="text" отоборажает масштаб в % */
var scaleValue = photoCorrectionForm.querySelector('.scale__control--value');
/** button type="button" уменьшает масштаб */
var scaleControlSmaller = photoCorrectionForm.querySelector('.scale__control--smaller');
/** button type="button" увеличивает масштаб */
var scaleControlBigger = photoCorrectionForm.querySelector('.scale__control--bigger');

/** @description  изменяет значение стилей, меняя масштаб фото*/
var scalingPhoto = function () {
  image.style.transform = 'scale(' + parseInt(scaleValue.value, 10) / 100 + ')';
};

/** @description уменьшает масштаб у фото, отображая значение в инпуте */
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

/** шкала изменения глубины фильтрации */
var filterRange = photoCorrectionForm.querySelector('.img-upload__effect-level');
/** функция сбрасывает фильтры на изображении */
var clearFilterList = function () {
  image.classList = 'img-upload__preview';
};

// /**
//  * @description считает отношение значения координат по x у мышки в момент к ширине dom-эелемента, округляет до сотых
//  * @param {evt} evt
//  */
// var checkProportions = function (evt) {
//   (evt.offsetX / filterRange.offsetWidth).toFixed(2);
// };


/** функция в зависимости от элемента, на котором было совершено инициирующее действие меняет стиль (накладывает фильтр) у фотографии
 * @param {evt} evt
*/
var changer = function (evt) {
  if (evt.target.classList.contains('effects__preview--chrome')) {
    clearFilterList();
    filterRange.classList.remove('hidden');
    image.classList.add('effects__preview--chrome');
  }
  if (evt.target.classList.contains('effects__preview--sepia')) {
    clearFilterList();
    filterRange.classList.remove('hidden');
    image.classList.add('effects__preview--sepia');
  }
  if (evt.target.classList.contains('effects__preview--marvin')) {
    clearFilterList();
    filterRange.classList.remove('hidden');
    image.classList.add('effects__preview--marvin');
  }
  if (evt.target.classList.contains('effects__preview--phobos')) {
    clearFilterList();
    filterRange.classList.remove('hidden');
    image.classList.add('effects__preview--phobos');
  }
  if (evt.target.classList.contains('effects__preview--heat')) {
    clearFilterList();
    filterRange.classList.remove('hidden');
    image.classList.add('effects__preview--heat');
  }
  if (evt.target.classList.contains('effects__preview--none')) {
    clearFilterList();
    filterRange.classList.add('hidden');
  }
};
