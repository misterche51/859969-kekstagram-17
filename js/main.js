'use strict';

// константа с количеством фотографий на главной
var COUNT_OF_PHOTOS = 25;

// объект, описывающий диапазон количества лайков под каждой фотографией
var LIKES_VALUE = {
  MIN: 15,
  MAX: 100
};

// объект, описывающий диапазон количества комментариев под каждой фотографией
var COMMENTS_VALUE = {
  MIN: 1,
  MAX: 8
};

// объект,  дописывающийиапазон индексов для ссылок на фото аватаров комментирующих пользователей
var AVATAR_INDEX = {
  MIN: 1,
  MAX: 6
};


// ищем произвольное числов заданном диапазоне
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// массив имен
var names = ['Ватерпежекосма', 'Кукуцаполь', 'Перкосрак', 'Тролебузина', 'Персострат',
  'Нисерха', 'Гус', 'Феопент', 'Сисиний', 'Амфилохий',
  'Ексакустодиан', 'Еразм', 'Логин', 'Никострат', 'Пугилий',
  'Шахроза', 'Валенсия', 'Олимпиада', 'Алладин', 'Кришна'];

// получаем произвольное имя из массива names, обрабатывая его рандомизатором
var getName = function (arrOfNames) {
  return arrOfNames[getRandomNumber(0, arrOfNames.length - 1)];
};

// массив с комментариями
var comments = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

// создаем рандомный комментрий
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

// вызываем функцию и записываем ее значение для дальнейшенго использования
var photos = createGallery(COUNT_OF_PHOTOS);


// начинаю работу с DOM

// находим контейнер, куда будем вставлять нагенерированные данные
var container = document.querySelector('.pictures');

// находим шаблон
var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

// создаем функцию, которая будет создавать фрагмент и наполнять его заполненными клонами
var createFragment = function () {
  var newFragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    pictureTemplate.querySelector('.picture__img').src = createGallery(COUNT_OF_PHOTOS)[i].url;
    pictureTemplate.querySelector('.picture__comments').textContent = createGallery(COUNT_OF_PHOTOS)[i].comments.length;
    pictureTemplate.querySelector('.picture__likes').textContent = createGallery(COUNT_OF_PHOTOS)[i].likes;
    var newPicture = pictureTemplate.cloneNode(true);
    newFragment.appendChild(newPicture);
  }
  return newFragment;
};

// присвоем результат вызоыва функции в переменную для дальнейшей вставки в html
var fragment = createFragment(photos);

// пушим фрагмент в документ
container.appendChild(fragment);


