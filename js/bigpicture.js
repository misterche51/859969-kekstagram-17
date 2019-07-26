'use strict';

(function () {
  var ESC_CODE = 27;
  var MIN_COMMENTS = 5;
  var COMMENTS_GAP = 5;

  var currentLastComment;

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
  };

  //  вот этот блок - копипаста из form, я пробовал переписать в модуль, чтобы был коллбек внутри, но не получается пока что
  var escapeKeydownHandler = function (evt) {
    if (evt.keyCode === ESC_CODE && evt.target.type !== 'text') {
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

  var getRandomAvatar = function (min, max) {
    return 'img/avatar-' + window.utils.getRandomNumber(min, max) + '.svg';
  };

  var createComment = function (item) {
    var newComment = commentTemplate.cloneNode(true);
    newComment.querySelector('.social__picture').src = getRandomAvatar(1, 6);
    newComment.querySelector('.social__text').textContent = item.message;
    return newComment;
  };

  var renderComments = function (item) {
    clearCommentsList();
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < item.comments.length; i++) {
      fragment.appendChild(createComment(item.comments[i]));
    }
    commentsList.appendChild(fragment);
  };

  var clearCommentsList = function () {
    commentsList.innerHTML = '';
  };


  var renderBigPicture = function (item) {
    renderPicture(item);
    renderComments(item);
    document.addEventListener('keydown', escapeKeydownHandler);
    closePictureOverlayButton.addEventListener('click', closePictureOverlay);
    moreComments(item);
  };


  var hideComments = function (item, commentaries) {
    for (var i = MIN_COMMENTS; i < item.comments.length; i++) {
      commentaries[i].classList.add('visually-hidden');
    }
  };

  var moreComments = function (item) {
    var commentaries = pictureOverlay.querySelectorAll('.social__comment');
    buttonMoreComments.classList.remove('visually-hidden');
    hideComments(item, commentaries);
    currentLastComment = MIN_COMMENTS;
    if (item.comments.length <= MIN_COMMENTS) {
      buttonMoreComments.classList.add('visually-hidden');
    }
    buttonMoreComments.addEventListener('click', function () {
      var nextComments = currentLastComment + COMMENTS_GAP;
      if (nextComments >= item.comments.length) {
        for (var j = currentLastComment; j < item.comments.length; j++) {
          commentaries[j].classList.remove('visually-hidden');
          buttonMoreComments.classList.add('visually-hidden');
        }
      } else {
        for (var k = currentLastComment; k < nextComments; k++) {
          buttonMoreComments.classList.remove('visually-hidden');
          commentaries[k].classList.remove('visually-hidden');
        }
        currentLastComment = nextComments;
      }
    });
  };

  window.bigpicture = {
    renderBigPicture: renderBigPicture,
  };
})();
