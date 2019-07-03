'use strict';
// модуль работы с галереей на главной
(function () {

  /** кнопка загрузки нового изображения */
  var inputPhoto = document.querySelector('#upload-file');
  /** section с button-ами фильтров галереи */
  var filters = document.querySelector('.img-filters');
  var shuffle = function (arr) {
    var j;
    var temp;
    for (var i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random()*(i+1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
  };
  /** правило сортировки по комментариям
   * @param {Array} a массив
   * @param {Array} b массив
   */
  var sortingByComments = function (a, b) {
    return b.comments.length - a.comments.length;
  };
  /** Функция создает массив с последними фотографиями (10 рандомных !!НЕПОВТОРЯЮЩИХСЯ) */
  var newestItems = function (arr) {
    return shuffle(arr.slice(0)).slice(0, 10);
  };
  /** Функция создает отсортированный массив по количеству комменатриев */
  var hottestItems = function (arr) {
    return arr.slice().sort(sortingByComments);
  };
  /** мапа для реализации отображения нужной галереи в зависимости от выбранного фильтпа */
  var idToRenderGallery = {
    'popular': galleryItems,
    'new': newestItems,
    'discussed': hottestItems
  };

  var deletePictures = function () {

  };


  /** массив для копирования данных с сервера */
  var galleryItems = [];
  /**
  * @param {Array} data -- данные с сервера в формате массива объектов
  */
  var successHandler = function (data) {
    // копирую данные для дальнейшей обработки
    galleryItems = data;
    window.render(galleryItems);
    // показываю интерфейс выбора фильтров отображения в галерее
    filters.classList.remove('img-filters--inactive');
  };

  var updateGallery = function (evt) {
    var filterName = evt.target.id.slice(7);
    window.render(idToRenderGallery[filterName](galleryItems));
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; padding: 50px 0;text-align: center; background-color: red;';
    node.style.position = 'fixed';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.api.load(successHandler, errorHandler);
  // навешиваемся на кнопку, чтобы открыть форму изменения загружаемого фото
  inputPhoto.addEventListener('change', window.form.open);

  var filtrationHandler = function (evt) {
    if (evt.target.type === 'button') {
      updateGallery(evt);
      evt.preventDefault();
    }
  };
  filters.addEventListener('click', filtrationHandler);


})();
