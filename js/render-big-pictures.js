'use strict';

(function () {
  var MIN_COMMENTS = 5;
  var COMMENTS_GAP = 5;

  var startComment = null;
  var stopComment = null;
  var currentComments = null;

  var body = document.querySelector('body');
  var pictureOverlay = document.querySelector('.big-picture');
  var pictureImage = pictureOverlay.querySelector('.big-picture__img');
  /** кнопка "загрузить еще комментариев" */
  var buttonMoreComments = pictureOverlay.querySelector('.comments-loader');
  /** блок с комментариями под фотографией */
  var commentsList = pictureOverlay.querySelector('.social__comments');
  /** шаблон комментария */
  var commentTemplate = document.querySelector('#comment')
    .content
    .querySelector('.social__comment');
  /** кнопка закрыть окно с картинкой */
  var closePictureOverlayButton = pictureOverlay.querySelector('.big-picture__cancel');


  /** функция закрывания окна с картинкой */
  var closePictureOverlay = function () {
    pictureOverlay.classList.add('hidden');
    document.removeEventListener('keydown', escapeKeydownHandler);
    closePictureOverlayButton.removeEventListener('click', closePictureOverlay);
    buttonMoreComments.removeEventListener('click', buttonMoreComments.fn);
    body.removeAttribute('class');
  };

  // вот этот блок - копипаста из form, я пробовал переписать в модуль, чтобы был коллбек внутри, но не получается пока что
  var escapeKeydownHandler = function (evt) {
    if (window.utils.isEscPressed(evt) && evt.target.type !== 'text') {
      closePictureOverlay();
    }
  };

  /**
  * @description создает фрагмент на странице и наполнять его заполненными клонами
  * @param {Object} item
  */
  var renderPicture = function (item) {
    pictureImage.querySelector('img').src = item.url;
    pictureOverlay.querySelector('.likes-count').textContent = item.likes;
    pictureOverlay.querySelector('.social__caption').textContent = item.description;
    pictureOverlay.querySelector('.comments-count').textContent = item.comments.length;

  };
  /** генерация произвольного аватара для комментария
   * @param {Number} min
   * @param {Number} max
   * @return {String} ссылка на рандомный аватар комментатора
  */
  var getRandomAvatar = function (min, max) {
    return 'img/avatar-' + window.utils.getRandomNumber(min, max) + '.svg';
  };

  /** создает комментарий по шаблону
   * @param {Object} item
   * @return {DOMElement}
  */
  var createComment = function (item) {
    var newComment = commentTemplate.cloneNode(true);
    newComment.querySelector('.social__picture').src = getRandomAvatar(1, 6);
    newComment.querySelector('.social__text').textContent = item.message;
    return newComment;
  };

  /** отображает комментарии в DOM
   * @param {Array} comments -- массив комментариев из объекта
  */
  var renderComments = function (comments) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < comments.length; i++) {
      fragment.appendChild(createComment(comments[i]));
    }
    commentsList.appendChild(fragment);
  };
  /** очищает dom-дерево от комментариев предыущего айтема */
  var clearCommentsList = function () {
    commentsList.innerHTML = '';
    buttonMoreComments.classList.add('visually-hidden');
  };
  /** добавляет еще непоказанные комментарии в dom
   *  @param {Array} comments -- массив комментариев из объекта
  */
  var addComments = function (comments) {
    startComment += COMMENTS_GAP;
    stopComment += COMMENTS_GAP;
    currentComments = comments.slice(startComment, stopComment);
    renderComments(currentComments);
    if (stopComment > comments.length) {
      stopComment = comments.length;
      buttonMoreComments.classList.add('visually-hidden');
    }
  };


  window.renderBigPicture = function (item) {
    clearCommentsList();
    renderPicture(item);
    var comments = item.comments;
    if (comments.length <= MIN_COMMENTS) {
      renderComments(comments);
    } else {
      buttonMoreComments.classList.remove('visually-hidden');
      startComment = 0;
      stopComment = MIN_COMMENTS;
      currentComments = comments.slice(startComment, stopComment);
      renderComments(currentComments);
      buttonMoreComments.addEventListener('click', buttonMoreComments.fn = function () {
        addComments(comments);
      });
    }
    body.setAttribute('class', 'modal-open');
    document.addEventListener('keydown', escapeKeydownHandler);
    closePictureOverlayButton.addEventListener('click', closePictureOverlay);
  };
})();
