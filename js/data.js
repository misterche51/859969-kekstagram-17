'use strict';
//  Модуль для генерации моков
(function () {
  /** количество генерируемых объектов-фото */
  var COUNT_OF_PHOTOS = 25;

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

  /** массив имен для магов */
  var names = ['Ватерпежекосма', 'Кукуцаполь', 'Перкосрак', 'Тролебузина', 'Персострат',
    'Нисерха', 'Гус', 'Феопент', 'Сисиний', 'Амфилохий',
    'Ексакустодиан', 'Еразм', 'Логин', 'Никострат', 'Пугилий',
    'Шахроза', 'Валенсия', 'Олимпиада', 'Алладин', 'Кришна'];

  /** массив с комментариями */
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

  /** создает массив объектов
   * @param {Number} countOfPhotos -- количество элементов в массиве
   * @return {Array}
   */
  var createGallery = function (countOfPhotos) {
    var gallery = [];
    for (var i = 1; i <= countOfPhotos; i++) {
      /** объект фотографии с url, комментариями и лайками */
      var photo = {
        url: 'photos/' + i + '.jpg',
        likes: getRandomNumber(LIKES_VALUE.MIN, LIKES_VALUE.MAX),
        comments: getArrayOfComments()
      };
      gallery.push(photo);
    }
    return gallery;
  };

  /**
   * @description массив объектов для вставки на страницу
   */
  var photos = createGallery(COUNT_OF_PHOTOS);

  window.photos = photos;

})();
