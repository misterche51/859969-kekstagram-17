'use strict';
// модуль работы с галереей на главной
(function () {
  /** кнопки фильтров */
  var buttons = document.querySelectorAll('.img-filters__button');
  /** сбрасывает стиль активности со всех батонов */
  var resetButtonStyle = function () {
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('img-filters__button--active');
    }
  };
  /** кнопка загрузки нового изображения */
  var inputPhoto = document.querySelector('#upload-file');
  /** section с button-ами фильтров галереи */
  var filters = document.querySelector('.img-filters');
  /** вспомогательная переменная для debounceHandler */
  var lastTimeout;
  /** массив для копирования данных с сервера */
  var galleryItems = [];
  /** функция удаления дребезжания
   * @param {callback} f
   */
  var debounceHandler = function (f) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      f();
    }, 500);
  };
  /** функция описывается работу фильтров галереи
   * @param {evt} evt
   */
  var filtrationHandler = function (evt) {
    if (evt.target.type === 'button') {
      debounceHandler(function () {
        updateGallery(evt);
      });
      resetButtonStyle();
      evt.target.classList.toggle('img-filters__button--active');
      evt.preventDefault();
    }
  };

  //  ----------------  блок сортировки  ---------------------------

  /** функция перемешивания массива
   * @param {Array} arr
   * @return {Array} перемешанный массив
   */
  var shuffle = function (arr) {
    //  копируем массив для обработки
    var shuffledArr = arr.slice(0);
    var j;
    var temp;
    for (var i = shuffledArr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = shuffledArr[j];
      shuffledArr[j] = shuffledArr[i];
      shuffledArr[i] = temp;
    }
    return shuffledArr;
  };
  /** правило сортировки по комментариям
   * @param {Array} a массив
   * @param {Array} b массив
   * @return {Number}
   */
  var sortingByComments = function (a, b) {
    return b.comments.length - a.comments.length;
  };
  /** Функция создает массив с последними фотографиями (10 рандомных неповторяющихся)
   * @param {Array} arr
   * @return {Array}
  */
  var newestItems = function (arr) {
    return shuffle(arr.slice(0)).slice(0, 10);
  };
  /** Функция создает отсортированный массив по количеству комменатриев
   * @param {Array} arr
   * @return {Array}
  */
  var hottestItems = function (arr) {
    return arr.slice().sort(sortingByComments);
  };
  /** мапа для реализации отображения нужной галереи в зависимости от выбранного фильтпа */
  var idToRenderGallery = {
    'new': newestItems,
    'discussed': hottestItems
  };

  //  --------------------------------------------------

  /** очищает галерею от всех фотографий */
  var deletePictures = function () {
    var pictures = document.querySelectorAll('.picture');
    for (var i = 0; i < pictures.length; i++) {
      pictures[i].remove();
    }
  };
  /**
   * функция выполняется при успешной загрузке данных с сервера
  * @param {Array} data -- данные с сервера в формате массива объектов
  */
  var successHandler = function (data) {
    // копирую данные для дальнейшей обработки
    galleryItems = data;
    window.render(galleryItems);
    // показываю интерфейс выбора фильтров отображения в галерее
    filters.classList.remove('img-filters--inactive');
  };
  /** функция обновления галереи при клике по фильтру
   * @param {evt} evt
  */
  var updateGallery = function (evt) {
    deletePictures();
    /** название фильтра, получаемое из id */
    var filterName = evt.target.id.slice(7);

    if (filterName === 'popular') {
      window.render(galleryItems);
    } else {
      window.render(idToRenderGallery[filterName](galleryItems));
    }
  };
  /** функция выполняется при неполадке во взаимодействии с сервером
   * @param {errorMessage} errorMessage
   */
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
  //  навешиваемся на секшн, чтобы запустить работу фильтров при клике
  filters.addEventListener('click', filtrationHandler);
})();
